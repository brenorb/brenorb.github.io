#!/usr/bin/env ruby
# frozen_string_literal: true

# Downloads remote images used in posts (<img src>, Markdown images, <video
# poster> and remote `feature:` images) into assets/remote/. The build then
# serves those copies instead of hot-linking (see _plugins/third_party_media.rb),
# so pages no longer wait on third-party hosts.
#
#   ruby scripts/self_host_remote_media.rb           # download missing copies
#   ruby scripts/self_host_remote_media.rb --list    # only list remote URLs

require 'cgi'
require 'digest'
require 'fileutils'
require 'net/http'
require 'uri'

ROOT = File.expand_path('..', __dir__)
OUT_DIR = File.join(ROOT, 'assets', 'remote')
SITE_HOST = 'brenorb.com'
IMAGE_EXTENSIONS = %w[.png .jpg .jpeg .gif .webp .svg .avif].freeze

# Same naming as ThirdPartyMedia.local_name in _plugins/third_party_media.rb.
def local_name(url)
  path = url.split(/[?#]/).first.to_s
  ext = File.extname(path).downcase
  query = url[/[?&]format=(\w+)/, 1]
  ext = ".#{query.downcase}" if query
  ext = '.img' unless IMAGE_EXTENSIONS.include?(ext)
  "#{Digest::SHA256.hexdigest(url)[0, 20]}#{ext}"
end

def fetch(url, limit = 5)
  uri = URI(url)
  proxy = ENV['https_proxy'] || ENV['HTTPS_PROXY']
  proxy = proxy && !proxy.empty? ? URI(proxy) : nil
  http = Net::HTTP.new(uri.host, uri.port, proxy&.host, proxy&.port)
  http.use_ssl = uri.scheme == 'https'
  response = http.request(Net::HTTP::Get.new(uri, 'User-Agent' => 'brenorb.com media mirror'))
  if response.is_a?(Net::HTTPRedirection) && limit.positive?
    return fetch(URI.join(url, response['location']).to_s, limit - 1)
  end

  response.is_a?(Net::HTTPSuccess) ? response.body : nil
end

urls = Dir[File.join(ROOT, '_posts', '*.{md,markdown,html}')].flat_map do |file|
  text = File.read(file, encoding: 'UTF-8')
  found = text.scan(/<img\b[^>]*\ssrc="(https?:[^"]+)"/i).flatten
  found += text.scan(/<video\b[^>]*\sposter="(https?:[^"]+)"/i).flatten
  found += text.scan(/!\[[^\]]*\]\((https?:[^)\s]+)/).flatten
  found += text.scan(/^feature:\s*["']?(https?:[^"'\s]+)/).flatten
  found
end
urls = urls.map { |url| CGI.unescapeHTML(url) }.reject { |url| URI(url).host.to_s.casecmp?(SITE_HOST) }.uniq.sort

if ARGV.include?('--list')
  urls.each { |url| puts "#{local_name(url)}  #{url}" }
  exit
end

FileUtils.mkdir_p(OUT_DIR)
failures = []
urls.each do |url|
  target = File.join(OUT_DIR, local_name(url))
  next if File.exist?(target)

  body = begin
    fetch(url)
  rescue StandardError => e
    warn "#{url}: #{e.message}"
    nil
  end
  if body
    File.binwrite(target, body)
    puts "saved #{File.basename(target)} <- #{url}"
  else
    failures << url
  end
end

warn "Could not download:\n  #{failures.join("\n  ")}" unless failures.empty?
