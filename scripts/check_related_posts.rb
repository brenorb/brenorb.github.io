#!/usr/bin/env ruby
# frozen_string_literal: true

require "cgi"
require "json"

root = File.expand_path("..", __dir__)
abort("Semantic related-page index is stale") unless system("node", File.join(root, "scripts/build_related_posts.mjs"), "--check")

site_dir = ARGV.fetch(0, "_site")
index = JSON.parse(File.read(File.join(root, "_data/related_posts.json")))
posts = JSON.parse(IO.popen([RbConfig.ruby, File.join(root, "scripts/export_related_posts.rb")], &:read))
errors = []
checked = 0

posts.each do |post|
  route = post.fetch("url")
  html = File.read(File.join(site_dir, route.delete_prefix("/"), "index.html"))
  section = html[/<section class="related-posts".*?<\/section>/m]
  links = section.to_s.scan(/<a href="([^"]+)"/).flatten.map { |url| CGI.unescapeHTML(url) }
  expected = index.fetch("pages").fetch(route).map { |item| item.fetch("url") }
  errors << "#{route}: rendered related pages differ from semantic ranking" unless links == expected
  errors << "#{route}: more than three related pages" if links.size > 3
  errors << "#{route}: duplicate related pages" if links.uniq != links
  errors << "#{route}: self-recommendation" if links.include?(route)
  checked += 1
end

abort(errors.join("\n")) unless errors.empty?
puts "Verified semantic related links on #{checked} article, media and project pages."
