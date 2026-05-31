#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "yaml"

MAX_FEATURE_BYTES = Integer(ENV.fetch("MAX_FEATURE_BYTES", "800000"))
POST_GLOB = "_posts/*.{md,markdown}"

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

def load_front_matter(path)
  content = File.read(path)
  match = content.match(/\A---\n(.*?)\n---\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
end

violations = []
missing = []

Dir[POST_GLOB].sort.each do |post_path|
  front_matter = load_front_matter(post_path)
  feature = front_matter["feature"]
  next unless feature.is_a?(String)
  next if feature.start_with?("http://", "https://")

  asset_path = feature.start_with?("/") ? feature[1..] : feature
  unless File.exist?(asset_path)
    missing << [post_path, asset_path]
    next
  end

  size = File.size(asset_path)
  next if size <= MAX_FEATURE_BYTES

  violations << [post_path, asset_path, size]
end

if missing.any? || violations.any?
  warn "Feature image check failed."

  missing.each do |post_path, asset_path|
    warn "- Missing feature asset for #{post_path}: #{asset_path}"
  end

  violations.each do |post_path, asset_path, size|
    warn "- #{post_path}: #{asset_path} is #{human_size(size)} (limit #{human_size(MAX_FEATURE_BYTES)})"
  end

  warn "Suggested fix: resize to about 1200px wide and export as a lighter JPG or PNG."
  exit 1
end

puts "Feature image check passed (#{MAX_FEATURE_BYTES} bytes max)."
