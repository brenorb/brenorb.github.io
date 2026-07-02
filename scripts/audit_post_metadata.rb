#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

POST_GLOB = "_posts/*.{md,markdown}"
REQUIRED_FIELDS = %w[description excerpt feature].freeze

def load_front_matter(path)
  content = File.read(path)
  match = content.match(/\A---\n(.*?)\n---\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
end

def blank?(value)
  value.nil? || (value.respond_to?(:empty?) && value.empty?) || value.to_s.strip.empty?
end

def tags_missing?(front_matter)
  tags = front_matter["tags"] || front_matter["tag"]
  blank?(tags)
end

def feature_missing?(front_matter)
  feature = front_matter["feature"]
  return true if blank?(feature)
  return false if feature.start_with?("http://", "https://")

  asset_path = feature.start_with?("/") ? feature[1..] : feature
  !File.exist?(asset_path)
end

problems = Hash.new { |hash, key| hash[key] = [] }

Dir[POST_GLOB].sort.each do |post_path|
  front_matter = load_front_matter(post_path)

  REQUIRED_FIELDS.each do |field|
    if field == "feature"
      problems["feature"] << post_path if feature_missing?(front_matter)
      next
    end

    problems[field] << post_path if blank?(front_matter[field])
  end

  problems["tags"] << post_path if tags_missing?(front_matter)
end

problem_count = problems.values.sum(&:size)

if problem_count.positive?
  warn "Post metadata audit failed."
  problems.each do |field, paths|
    next if paths.empty?

    warn
    warn "#{field}: #{paths.size}"
    paths.each { |path| warn "- #{path}" }
  end
  exit 1
end

puts "Post metadata audit passed for #{Dir[POST_GLOB].size} posts."
