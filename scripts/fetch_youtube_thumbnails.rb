#!/usr/bin/env ruby
# frozen_string_literal: true

# Downloads a local thumbnail for every YouTube video embedded in a post, so the
# click-to-play placeholders (see _plugins/lite_youtube.rb) need no third-party
# request. Run it after adding a post with a YouTube embed:
#
#   ruby scripts/fetch_youtube_thumbnails.rb
#
# Writes assets/img/youtube/<id>.webp (640x360). Videos also used as a post
# `feature` image get a JPEG copy too, for Open Graph and Twitter cards.
# Requires ImageMagick (`convert`) with WebP support.

require 'fileutils'
require 'net/http'
require 'tmpdir'
require 'uri'

ROOT = File.expand_path('..', __dir__)
OUT_DIR = File.join(ROOT, 'assets', 'img', 'youtube')
ID = '[A-Za-z0-9_-]{11}'

embed_ids = []
feature_ids = []
Dir[File.join(ROOT, '_posts', '*.{md,markdown,html}')].each do |file|
  text = File.read(file, encoding: 'UTF-8')
  embed_ids.concat(text.scan(%r{youtube(?:-nocookie)?\.com/embed/(#{ID})}).flatten)
  feature_ids.concat(text.scan(%r{^feature:\s*["']?https?://(?:img|i)\.(?:youtube|ytimg)\.com/vi/(#{ID})/}).flatten)
end

def fetch(url)
  uri = URI(url)
  # Net::HTTP only reads http_proxy on its own; honour HTTPS_PROXY too.
  proxy = ENV['https_proxy'] || ENV['HTTPS_PROXY']
  proxy = proxy && !proxy.empty? ? URI(proxy) : nil
  http = Net::HTTP.new(uri.host, uri.port, proxy&.host, proxy&.port)
  http.use_ssl = uri.scheme == 'https'
  response = http.request(Net::HTTP::Get.new(uri))
  response.is_a?(Net::HTTPSuccess) ? response.body : nil
end

def download_thumbnail(id)
  %w[maxresdefault sddefault hqdefault].each do |name|
    body = fetch("https://i.ytimg.com/vi/#{id}/#{name}.jpg")
    # YouTube answers missing sizes with a tiny grey placeholder.
    return body if body && body.bytesize > 2_000
  end
  nil
end

FileUtils.mkdir_p(OUT_DIR)
failures = []
(embed_ids + feature_ids).uniq.sort.each do |id|
  webp = File.join(OUT_DIR, "#{id}.webp")
  jpg = File.join(OUT_DIR, "#{id}.jpg")
  need_jpg = feature_ids.include?(id)
  next if File.exist?(webp) && (!need_jpg || File.exist?(jpg))

  source = download_thumbnail(id)
  unless source
    failures << id
    next
  end

  Dir.mktmpdir do |dir|
    src = File.join(dir, 'source.jpg')
    File.binwrite(src, source)
    crop = %w[-resize 640x480^ -gravity center -crop 640x360+0+0 +repage -strip]
    system('convert', src, *crop, '-quality', '62', webp, exception: true)
    system('convert', src, *crop, '-quality', '82', '-interlace', 'Plane', jpg, exception: true) if need_jpg
  end
  puts "saved #{id}"
end

abort("Could not download thumbnails for: #{failures.join(', ')}") unless failures.empty?
