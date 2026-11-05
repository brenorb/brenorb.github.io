#!/usr/bin/env ruby
# frozen_string_literal: true

# Creates a WebP copy next to every local JPEG/PNG used by posts and pages:
# `feature:` images and images in the content (<img src> and Markdown images).
# The build serves the WebP copy (see _plugins/webp_variant.rb); Open Graph and
# Twitter cards keep using the original file.
#
#   ruby scripts/build_webp_images.rb
#
# Requires ImageMagick (`convert`) with WebP support.

ROOT = File.expand_path('..', __dir__)
MAX_WIDTH = 1600
QUALITY = 62

sources = (Dir[File.join(ROOT, '_posts', '*.{md,markdown,html}')] +
           Dir[File.join(ROOT, '{*,*/*}.{md,markdown,html}')] +
           Dir[File.join(ROOT, '{_layouts,_includes}', '**', '*.html')]).uniq
sources.reject! { |file| file.include?('/_site/') || file.include?('/vendor/') }

paths = sources.flat_map do |file|
  text = File.read(file, encoding: 'UTF-8')
  text.scan(/^feature:\s*["']?([^"'\s]+)/).flatten +
    text.scan(/<img\b[^>]*\ssrc="([^"]+)"/i).flatten +
    text.scan(/!\[[^\]]*\]\(([^)\s]+)/).flatten
end

paths.uniq.sort.each do |path|
  next if path.match?(%r{\A(https?:)?//}) || path.include?('{{')
  next unless path.match?(/\.(png|jpe?g)\z/i)

  source = File.join(ROOT, path.sub(%r{\A/}, ''))
  next unless File.exist?(source)

  target = source.sub(/\.(png|jpe?g)\z/i, '.webp')
  next if File.exist?(target) && File.mtime(target) >= File.mtime(source)

  system('convert', source, '-resize', "#{MAX_WIDTH}x>", '-strip', '-quality', QUALITY.to_s, target, exception: true)
  saved = File.size(source) - File.size(target)
  if saved <= 0
    File.delete(target) # WebP is not smaller; keep serving the original.
    puts "#{File.basename(source)}: kept original"
  else
    puts "#{File.basename(target)}: #{File.size(source) / 1024} KB -> #{File.size(target) / 1024} KB"
  end
end
