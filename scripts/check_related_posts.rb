#!/usr/bin/env ruby
# frozen_string_literal: true

# Verifies that article and media pages link up to three related pages that share a tag.
# Usage: ruby scripts/check_related_posts.rb [site_dir]

require_relative "lib/site_source"

site_dir = ARGV.fetch(0, "_site")
posts = SiteSource.posts.to_h { |post| [post.permalink, post] }
errors = []
checked = 0

posts.each do |route, post|
  next unless post.section["related"]

  html = SiteSource.read(SiteSource.output_path(site_dir, route))
  section = html[/<section class="related-posts".*?<\/section>/m]
  links = section.to_s.scan(/<a href="([^"]+)"/).flatten
  eligible = posts.reject { |other_route, other| other_route == route || (post.tags & other.tags).empty? }
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
