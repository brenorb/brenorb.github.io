#!/usr/bin/env ruby
# frozen_string_literal: true

# Checks the <head> metadata of every built page: valid JSON-LD everywhere and,
# on indexable pages rendered with the site head (_includes/head.html), one
# canonical URL, og:url matching it, absolute share-image URLs, and Article
# JSON-LD on article pages. Standalone pages with their own <head> (such as
# /envelope_demo/) are skipped.
# Usage: ruby scripts/check_head_meta.rb [site_dir]

require "json"
require_relative "lib/site_source"

site_dir = ARGV.fetch(0, "_site")
errors = []
checked = 0

Dir[File.join(site_dir, "**", "*.html")].sort.each do |file|
  html = SiteSource.read(file)
  name = file.delete_prefix("#{site_dir}/")

  html.scan(%r{<script type="application/ld\+json">(.*?)</script>}m).flatten.each do |json|
    JSON.parse(json)
  rescue JSON::ParserError => e
    errors << "#{name}: invalid JSON-LD (#{e.message.lines.first.strip})"
  end

  next if html[/<meta name="robots" content="([^"]+)"/, 1].to_s.include?("noindex")
  next unless html.include?(%(<meta property="og:site_name"))

  canonicals = html.scan(/<link rel="canonical" href="([^"]+)">/).flatten
  errors << "#{name}: expected one canonical link, found #{canonicals.size}" unless canonicals.size == 1
  og_url = html[/<meta property="og:url" content="([^"]+)">/, 1]
  errors << "#{name}: og:url #{og_url.inspect} does not match canonical #{canonicals.first}" unless og_url == canonicals.first

  {
    "og:image" => /<meta property="og:image" content="([^"]*)">/,
    "twitter:image" => /<meta name="twitter:image" content="([^"]*)">/
  }.each do |tag, pattern|
    url = html[pattern, 1]
    errors << "#{name}: #{tag} must be an absolute URL, got #{url.inspect}" unless url&.match?(%r{\Ahttps?://[^/]+/[^/]})
  end

  if html.include?(%(<meta property="og:type" content="article">)) && !html.include?(%("@type": "Article"))
    errors << "#{name}: article page is missing Article JSON-LD"
  end
  checked += 1
end

minimum = SiteSource.posts.size
errors << "only #{checked} pages carry the site head metadata (expected at least #{minimum})" if checked < minimum

abort(errors.join("\n")) unless errors.empty?
puts "Verified head metadata on #{checked} indexable pages."
