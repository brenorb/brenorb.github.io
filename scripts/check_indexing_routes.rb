#!/usr/bin/env ruby
# frozen_string_literal: true

site_dir = ARGV.fetch(0, "_site")
checks = {
  "/ai-hack-for-freedom-primeiro-lugar/" => {
    canonical: "https://brenorb.com/project/stringer-safety/",
    redirect: true
  },
  "/{{ site.url }}/tags/" => {
    canonical: "https://brenorb.com/tags/",
    redirect: true
  },
  "/contact/" => {
    canonical: "https://brenorb.com/contact/",
    redirect: false
  }
}

errors = checks.filter_map do |route, expectation|
  output_path = File.join(site_dir, route.delete_prefix("/"), "index.html")
  next "#{route} was not generated at #{output_path}" unless File.file?(output_path)

  html = File.read(output_path)
  canonical = %(<link rel="canonical" href="#{expectation[:canonical]}">)
  next "#{route} does not canonicalize to #{expectation[:canonical]}" unless html.include?(canonical)

  if expectation[:redirect]
    refresh = %(http-equiv="refresh" content="0; url=#{expectation[:canonical]}")
    next "#{route} is missing its redirect to #{expectation[:canonical]}" unless html.include?(refresh)
    next "#{route} redirect must be noindex" unless html.include?(%(<meta name="robots" content="noindex">))
  end

  nil
end

if errors.any?
  warn errors.join("\n")
  exit 1
end

puts "Verified #{checks.length} Google indexing routes."
