#!/usr/bin/env ruby
# frozen_string_literal: true

# Fails when a built page links to a site path (or https://brenorb.com URL)
# that does not exist in the build. Checks href, src and srcset attributes.
# Usage: ruby scripts/check_internal_links.rb [site_dir]

require "uri"
require_relative "lib/site_source"

site_dir = File.expand_path(ARGV.fetch(0, "_site"))

def built?(site_dir, path)
  # Percent-decode only (a literal "+" stays "+"), and stay inside the build.
  file = File.expand_path(URI::DEFAULT_PARSER.unescape(path.delete_prefix("/")), site_dir)
  return false unless file == site_dir || file.start_with?("#{site_dir}/")

  File.file?(file) || File.file?(File.join(file, "index.html")) || File.file?("#{file}.html")
end

broken = Hash.new { |hash, key| hash[key] = [] }
pages = Dir[File.join(site_dir, "**", "*.html")].sort

pages.each do |file|
  html = SiteSource.read(file)
  page = file.delete_prefix("#{site_dir}/")
  urls = html.scan(/(href|src|srcset)="([^"]+)"/).flat_map do |attribute, value|
    attribute == "srcset" ? value.split(",").map { |candidate| candidate.strip.split(/\s+/).first.to_s } : [value]
  end
  urls.each do |url|
    url = url.delete_prefix(SiteSource::SITE_URL)
    next unless url.start_with?("/") && !url.start_with?("//")

    path = url.split(/[?#]/).first
    path = "/" if path.empty?
    broken[path] << page unless built?(site_dir, path)
  end
end

unless broken.empty?
  broken.each { |path, from| warn "#{path} (linked from #{from.uniq.first(3).join(', ')})" }
  abort "#{broken.size} broken internal link target(s)."
end

puts "Verified internal links on #{pages.size} pages."
