#!/usr/bin/env ruby
# frozen_string_literal: true

# Reports posts missing the metadata used by search and social previews.

require_relative "lib/site_source"

REQUIRED_FIELDS = %w[description excerpt].freeze

def blank?(value)
  value.nil? || (value.respond_to?(:empty?) && value.empty?) || value.to_s.strip.empty?
end

def feature_missing?(feature)
  return true if blank?(feature)

  asset = SiteSource.local_asset(feature)
  asset && !File.exist?(asset)
end

posts = SiteSource.posts
problems = Hash.new { |hash, key| hash[key] = [] }

posts.each do |post|
  name = SiteSource.relative(post.path)
  REQUIRED_FIELDS.each { |field| problems[field] << name if blank?(post.data[field]) }
  problems["feature"] << name if feature_missing?(post.data["feature"])
  problems["tags"] << name if post.tags.empty?
end

if problems.values.any?(&:any?)
  warn "Post metadata audit failed."
  problems.each do |field, names|
    next if names.empty?

    warn
    warn "#{field}: #{names.size}"
    names.each { |name| warn "- #{name}" }
  end
  exit 1
end

puts "Post metadata audit passed for #{posts.size} posts."
