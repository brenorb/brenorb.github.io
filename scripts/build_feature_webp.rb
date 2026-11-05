#!/usr/bin/env ruby
# frozen_string_literal: true

# Creates a WebP copy next to every local `feature:` image used by posts and
# pages. The page header and video posters use the WebP copy (see
# _plugins/webp_variant.rb); Open Graph and Twitter cards keep the original.
#
#   ruby scripts/build_feature_webp.rb
#
# Requires ImageMagick (`convert`) with WebP support.

ROOT = File.expand_path('..', __dir__)
MAX_WIDTH = 1280
QUALITY = 62

sources = Dir[File.join(ROOT, '{_posts,_pages,*,*/*}.{md,markdown,html}')] +
          Dir[File.join(ROOT, '_posts', '*.{md,markdown,html}')]
features = sources.uniq.flat_map do |file|
  next [] if file.include?('/_site/') || file.include?('/vendor/')

  File.read(file, encoding: 'UTF-8').scan(/^feature:\s*["']?([^"'\s]+)/).flatten
end

features.uniq.sort.each do |feature|
  next if feature.match?(%r{\Ahttps?://})
  next unless feature.match?(/\.(png|jpe?g)\z/i)

  source = File.join(ROOT, feature.delete_prefix('/'))
  next unless File.exist?(source)

  target = source.sub(/\.(png|jpe?g)\z/i, '.webp')
  next if File.exist?(target) && File.mtime(target) >= File.mtime(source)

  system('convert', source, '-resize', "#{MAX_WIDTH}x>", '-strip', '-quality', QUALITY.to_s, target, exception: true)
  puts "#{File.basename(target)}: #{File.size(source) / 1024} KB -> #{File.size(target) / 1024} KB"
end
