#!/usr/bin/env ruby
# frozen_string_literal: true

require "cgi"
require "date"
require "json"
require "pathname"
require "time"
require "yaml"

root = Pathname.new(File.expand_path("..", __dir__))
chapter_specs = JSON.parse(root.join("scripts/topic_chapters.json").read)

def plain_text(text)
  text.to_s
      .gsub(%r{<(script|style|iframe|video|audio)\b.*?</\1>}im, " ")
      .gsub(/\{%.*?%\}|\{\{.*?\}\}/m, " ")
      .gsub(/!\[[^\]]*\]\([^)]*\)/, " ")
      .gsub(/\[([^\]]+)\]\([^)]*\)/, '\1')
      .gsub(/https?:\/\/\S+/, " ")
      .gsub(/\{:[^}]*\}|<[^>]+>/, " ")
      .then { |s| CGI.unescapeHTML(s) }
      .gsub(/\s+/, " ").strip
end

posts = root.join("_posts").children.sort.filter_map do |path|
  next unless path.extname == ".md"

  _, front_matter, body = path.read.split(/^---\s*$/, 3)
  data = YAML.safe_load(front_matter, permitted_classes: [Date, Time]) || {}
  next if data["published"] == false || data["sitemap"] == false || data["noindex"] == true

  url = data.fetch("permalink")
  slug = data["slug"] || path.basename(".md").to_s.sub(/^\d{4}-\d{2}-\d{2}-/, "")
  chapters = chapter_specs.dig(slug, "chapters") || []
  summary = [data["description"], data["excerpt"]].compact.uniq.join(" ")
  {
    url: url,
    title: data.fetch("title"),
    content_type: data.fetch("content_type", "article"),
    summary: plain_text([data["title"], summary].join(". ")),
    # Model input is prose, not tag overlap, HTML boilerplate or raw transcripts.
    text: plain_text([body, chapters.map { |c| c.fetch("title") }.join(". ")].join("\n\n"))
  }
end

puts JSON.generate(posts.sort_by { |post| post.fetch(:url) })
