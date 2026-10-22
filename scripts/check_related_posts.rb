#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

site_dir = ARGV.fetch(0, "_site")
posts = Dir[File.expand_path("../_posts/*.md", __dir__)].map do |path|
  data = YAML.safe_load(File.read(path).split(/^---\s*$/, 3)[1], permitted_classes: [Date, Time])
  [data.fetch("permalink"), data]
end.to_h
errors = []
checked = 0

posts.each do |route, data|
  next if data["content_type"] == "project"

  html = File.read(File.join(site_dir, route.delete_prefix("/"), "index.html"))
  section = html[/<section class="related-posts".*?<\/section>/m]
  links = section.to_s.scan(/<a href="([^"]+)"/).flatten
  tags = Array(data["tags"] || data["tag"])
  eligible = posts.reject { |other_route, other| other_route == route || (tags & Array(other["tags"])).empty? }
  errors << "#{route}: empty related section" if section && links.empty?
  errors << "#{route}: missing related pages" if eligible.any? && links.empty?
  errors << "#{route}: more than three related pages" if links.size > 3
  errors << "#{route}: duplicate related pages" if links.uniq != links
  links.each do |target|
    errors << "#{route}: #{target} does not share a topic tag" unless eligible.key?(target)
  end
  checked += 1
end

abort(errors.join("\n")) unless errors.empty?
puts "Verified relevant internal links on #{checked} article and media pages."
