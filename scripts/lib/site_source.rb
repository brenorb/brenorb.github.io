# frozen_string_literal: true

# Shared helpers for the repo's Ruby check and build scripts:
# reading source files, parsing front matter, and locating built pages.
#
# Files are always read as UTF-8, so scripts behave the same regardless of
# the shell locale (a non-UTF-8 LANG used to crash them).

require "date"
require "yaml"

module SiteSource
  ROOT = File.expand_path("../..", __dir__)
  SITE_URL = "https://brenorb.com"
  POST_GLOB = "_posts/*.{md,markdown}"

  Post = Struct.new(:path, :data, :body, keyword_init: true) do
    def permalink
      data["permalink"].to_s
    end

    def content_type
      data["content_type"].to_s
    end

    def tags
      Array(data["tags"] || data["tag"])
    end

    # Section settings from _data/sections.yml (archive, related).
    def section
      SiteSource.sections.fetch(content_type) { SiteSource.sections.fetch("article") }
    end
  end

  module_function

  def path(relative)
    File.join(ROOT, relative)
  end

  def read(file)
    File.read(file, encoding: "UTF-8")
  end

  # Repo-relative path for messages.
  def relative(file)
    file.delete_prefix("#{ROOT}/")
  end

  # Safe YAML loading with the types Jekyll front matter and config use.
  def load_yaml(text)
    YAML.safe_load(text.to_s, permitted_classes: [Date, Time], aliases: true) || {}
  end

  # Returns [front_matter_hash, body]. Files without front matter return [{}, text].
  def parse(text)
    return [{}, text] unless text.start_with?("---")

    _, yaml, body = text.split(/^---\s*$/, 3)
    [load_yaml(yaml), body.to_s]
  end

  def front_matter(file)
    parse(read(file)).first
  end

  def sections
    @sections ||= load_yaml(read(path("_data/sections.yml")))
  end

  # True when an archive page's generated post list (not its intro text)
  # links to `route`, as a relative or absolute URL.
  def listed_in_archive?(archive_html, route)
    list = archive_html[%r{<div class="post-list">.*?</ul>}m].to_s
    list.include?(%(href="#{route}")) || list.include?(%(href="#{absolute_url(route)}"))
  end

  # All posts in filename order (oldest first).
  def posts
    Dir[path(POST_GLOB)].sort.map do |file|
      data, body = parse(read(file))
      Post.new(path: file, data: data, body: body)
    end
  end

  # Path of the generated file for a route such as "/about/" or "/404".
  def output_path(site_dir, route)
    relative = route.delete_prefix("/")
    relative = "index.html" if relative.empty?
    relative = "#{relative}index.html" if relative.end_with?("/")
    File.join(site_dir, relative)
  end

  def absolute_url(route)
    "#{SITE_URL}#{route.start_with?('/') ? route : "/#{route}"}"
  end

  # Local asset path for a front-matter image reference, or nil when it is remote.
  def local_asset(reference)
    ref = reference.to_s
    return nil if ref.empty? || ref.include?("://") || ref.start_with?("//")

    path(ref.delete_prefix("/"))
  end
end
