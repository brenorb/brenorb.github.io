#!/usr/bin/env ruby
# frozen_string_literal: true

# Fails when a post's local `feature:` image is missing or larger than the limit.

require_relative "lib/site_source"

MAX_FEATURE_BYTES = Integer(ENV.fetch("MAX_FEATURE_BYTES", "800000"))

def human_size(bytes)
  units = %w[B KB MB GB]
  size = bytes.to_f
  unit = units.shift
  while size >= 1024 && !units.empty?
    size /= 1024
    unit = units.shift
  end
  format(size >= 10 || unit == "B" ? "%.0f %s" : "%.1f %s", size, unit)
end

violations = []
missing = []

SiteSource.posts.each do |post|
  feature = post.data["feature"]
  next unless feature.is_a?(String)

  asset = SiteSource.local_asset(feature)
  next unless asset

  name = SiteSource.relative(post.path)
  if !File.exist?(asset)
    missing << [name, SiteSource.relative(asset)]
  elsif File.size(asset) > MAX_FEATURE_BYTES
    violations << [name, SiteSource.relative(asset), File.size(asset)]
  end
end

if missing.any? || violations.any?
  warn "Feature image check failed."
  missing.each { |name, asset| warn "- Missing feature asset for #{name}: #{asset}" }
  violations.each do |name, asset, size|
    warn "- #{name}: #{asset} is #{human_size(size)} (limit #{human_size(MAX_FEATURE_BYTES)})"
  end
  warn "Suggested fix: resize to about 1200px wide and export as a lighter JPG or PNG."
  exit 1
end

puts "Feature image check passed (#{MAX_FEATURE_BYTES} bytes max)."
