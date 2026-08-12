#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

ROOT = File.expand_path("..", __dir__)

def normalize_path(value)
  path = value.to_s.strip
  return nil if path.empty?

  path = "/#{path}" unless path.start_with?("/")
  path = "/#{path.split("/", -1).reject(&:empty?).join("/")}/"
  path == "//" ? "/" : path
end

def paths_from(value)
  case value
  when Array then value.filter_map { |item| normalize_path(item) }
  when nil then []
  else [normalize_path(value)].compact
  end
end

def front_matter(source)
  return nil unless source.start_with?("---")

  source.split(/^---\s*$/, 3)[1]
end

def metadata(source)
  YAML.safe_load(front_matter(source), permitted_classes: [Date, Time]) || {}
end

def key_range(lines, key)
  start = lines.index { |line| line.match?(/^#{Regexp.escape(key)}:/) }
  return nil unless start

  finish = start + 1
  while finish < lines.length
    line = lines[finish]
    break unless line.strip.empty? || line.start_with?(" ", "\t", "-")

    finish += 1
  end
  [start, finish]
end

def insert_after_layout(lines, additions)
  layout_index = lines.index { |line| line.start_with?("layout:") }
  index = layout_index ? layout_index + 1 : 0
  lines.insert(index, *additions)
end

changed = 0

Dir[File.join(ROOT, "_posts", "*.md")].sort.each do |path|
  source = File.read(path)
  yaml = front_matter(source)
  next unless yaml

  data = metadata(source)
  content_type = data.fetch("content_type", "article").to_s
  filename_slug = File.basename(path, ".md").sub(/^\d{4}-\d{2}-\d{2}-/, "")
  filename_permalink = normalize_path("/#{filename_slug}/")
  old_permalink = normalize_path(data["permalink"] || filename_permalink)
  slug = old_permalink.split("/").reject(&:empty?).last
  prefix = { "article" => "articles", "media" => "media", "project" => "projects" }.fetch(content_type, "articles")
  new_permalink = "/#{prefix}/#{slug}/"

  redirects = paths_from(data["redirect_from"])
  redirects << old_permalink unless old_permalink == new_permalink
  redirects << filename_permalink unless filename_permalink == new_permalink
  redirects = redirects.uniq.reject { |redirect| redirect == new_permalink }

  lines = yaml.lines
  ["permalink", "redirect_from"].filter_map { |key| key_range(lines, key) }.sort_by(&:first).reverse_each do |start, finish|
    lines.slice!(start...finish)
  end

  additions = ["permalink: #{new_permalink}\n"]
  unless redirects.empty?
    additions << "redirect_from:\n"
    redirects.each { |redirect| additions << "  - #{redirect}\n" }
  end
  insert_after_layout(lines, additions)

  updated_yaml = lines.join
  updated = source.sub(yaml, updated_yaml)
  next if updated == source

  File.write(path, updated)
  changed += 1
end

puts "Migrated #{changed} post front matters to content-type URL prefixes."
