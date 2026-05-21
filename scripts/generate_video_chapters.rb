#!/usr/bin/env ruby

require "json"
require "uri"

def format_timestamp(seconds)
  total = seconds.to_i
  hours = total / 3600
  minutes = (total % 3600) / 60
  secs = total % 60
  return format("%02d:%02d:%02d", hours, minutes, secs) if hours.positive?
  format("%02d:%02d", minutes, secs)
end

def youtube_timestamp_url(url, seconds)
  uri = URI(url)
  params = URI.decode_www_form(String(uri.query))
  params.reject! { |key, _| key == "t" }
  params << ["t", seconds.to_i.to_s]
  uri.query = URI.encode_www_form(params)
  uri.to_s
end

abort "usage: #{$PROGRAM_NAME} transcript.json [video_url]" unless ARGV[0]

path = ARGV[0]
data = JSON.parse(File.read(path))
video_url = ARGV[1] || data["input_source"]
chunks = Array(data["chunks"])

puts "<details>"
puts "  <summary>Capítulos por minuto</summary>"
puts "  <ul>"

chunks.each do |chunk|
  start_s = chunk.fetch("start_s", 0).to_i
  end_s = chunk.fetch("end_s", start_s).to_i
  stamp = "#{format_timestamp(start_s)}–#{format_timestamp(end_s)}"
  link = if video_url&.include?("youtube.com/watch")
    youtube_timestamp_url(video_url, start_s)
  else
    video_url
  end

  if link && !link.empty?
    puts "    <li><a href=\"#{link}\">#{stamp}</a></li>"
  else
    puts "    <li>#{stamp}</li>"
  end
end

puts "  </ul>"
puts "</details>"
