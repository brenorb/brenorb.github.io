#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

site_dir = ARGV.fetch(0, "_site")
checks = {
  "/ai-hack-for-freedom-primeiro-lugar/" => {
    canonical: "https://brenorb.com/projects/stringer-safety/",
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

content_routes = %w[
  /media/palestra-introducao-a-opcoes/
  /media/podcast-stealth-fountain/
  /media/podcast-bipa-cast-22-101-perguntas-sobre-bitcoin/
  /media/podcast-fernando-caixeta-101-perguntas-sobre-bitcoin/
  /media/podcast-bipa-cast-38-satsconf/
  /media/podcast-sessao-de-hopium-ep-20/
  /media/ordinals-devem-ser-banidos/
  /media/podcast-explica-bitcoin-ia-fim-da-historia-humana/
  /media/podcast-criptoverso-54-breno-brito/
  /articles/os-7-fundamentos-do-maximalismo-do-bitcoin/
]

intentional_noindex_routes = {
  "/project/fast-transcript/" => {
    output_path: "project/fast-transcript/index.html",
    canonical: "https://brenorb.com/projects/fast-transcript/",
    redirect: true
  },
  "/project/docs2epub/" => {
    output_path: "project/docs2epub/index.html",
    canonical: "https://brenorb.com/projects/docs2epub/",
    redirect: true
  },
  "/project/lkdn/" => {
    output_path: "project/lkdn/index.html",
    canonical: "https://brenorb.com/projects/lkdn/",
    redirect: true
  },
  "/interviews/" => {
    output_path: "interviews/index.html",
    canonical: "https://brenorb.com/media/",
    redirect: true
  },
  "/posts/" => {
    output_path: "posts/index.html",
    canonical: "https://brenorb.com/articles/",
    redirect: true
  },
  "/404" => {
    output_path: "404.html",
    canonical: "https://brenorb.com/404",
    redirect: false
  }
}

canonical_project_routes = %w[
  /projects/fast-transcript/
  /projects/docs2epub/
  /projects/lkdn/
]

english_routes = %w[
  /about/
  /articles/role-bitcoin-gen-ai/
  /projects/bip39-portuguese-wordlist/
  /projects/bitchat-cli/
  /projects/bitdevs-brasilia/
  /projects/btc-graph/
  /projects/docs2epub/
  /projects/fast-transcript/
  /projects/filepizza-cli/
  /projects/fran/
  /projects/freedom-skills/
  /projects/granola/
  /projects/lkdn/
  /projects/minimaxis/
  /projects/nowhere-cli/
  /projects/portfolio-optimization-thesis/
  /projects/reinforcement-learning-financial-markets-thesis/
  /projects/satoshi-7b/
  /projects/stealth/
  /projects/stringer-safety/
]

source_root = File.expand_path("..", File.expand_path(site_dir))

def route_output_path(site_dir, route)
  relative = route.delete_prefix("/")
  relative = "index.html" if relative.empty?
  relative = "#{relative}index.html" if relative.end_with?("/")
  File.join(site_dir, relative)
end

def source_metadata(path)
  source = File.read(path)
  return {} unless source.start_with?("---")

  yaml = source.split(/^---\s*$/, 3)[1]
  YAML.safe_load(yaml, permitted_classes: [Date, Time]) || {}
end

def metadata_paths(value)
  case value
  when Array then value
  when nil then []
  else [value]
  end
end

post_route_errors = []
Dir[File.join(source_root, "_posts", "*.md")].sort.each do |source_path|
  data = source_metadata(source_path)
  route = data["permalink"].to_s
  next if route.empty?

  output_path = route_output_path(site_dir, route)
  unless File.file?(output_path)
    post_route_errors << "#{route} was not generated at #{output_path}"
    next
  end

  html = File.read(output_path)
  canonical_url = "https://brenorb.com#{route}"
  post_route_errors << "#{route} is missing its self-canonical URL" unless html.include?(%(<link rel="canonical" href="#{canonical_url}">))
  post_route_errors << "#{route} must not be noindex" if html.match?(%r{<meta name="robots" content="noindex})

  archive = case data["content_type"].to_s
            when "media" then "/media/"
            when "project" then "/projects/"
            else "/articles/"
            end
  archive_html = File.read(route_output_path(site_dir, archive))
  post_route_errors << "#{route} is missing from #{archive}" unless archive_html.include?(canonical_url)
  post_route_errors << "#{route} is missing from the sitemap" unless File.read(File.join(site_dir, "sitemap.xml")).include?("<loc>#{canonical_url}</loc>")

  expected_lang = data["lang"].to_s.empty? ? "pt-BR" : data["lang"].to_s
  post_route_errors << "#{route} must declare lang=\"#{expected_lang}\"" unless html.match?(%r{<html[^>]+lang="#{Regexp.escape(expected_lang)}"})

  metadata_paths(data["redirect_from"]).each do |redirect|
    redirect_route = redirect.to_s
    next if redirect_route.empty?

    redirect_path = route_output_path(site_dir, redirect_route)
    unless File.file?(redirect_path)
      post_route_errors << "#{route} is missing its redirect output for #{redirect_route}"
      next
    end

    redirect_html = File.read(redirect_path)
    post_route_errors << "#{redirect_route} must canonicalize to #{canonical_url}" unless redirect_html.include?(%(<link rel="canonical" href="#{canonical_url}">))
    post_route_errors << "#{redirect_route} must be noindex" unless redirect_html.match?(%r{<meta name="robots" content="noindex})
    post_route_errors << "#{redirect_route} is missing its redirect to #{canonical_url}" unless redirect_html.include?(%(http-equiv="refresh" content="0; url=#{canonical_url}"))
  end
end

errors = checks.filter_map do |route, expectation|
  output_path = File.join(site_dir, route.delete_prefix("/"), "index.html")
  next "#{route} was not generated at #{output_path}" unless File.file?(output_path)

  html = File.read(output_path)
  canonical = %(<link rel="canonical" href="#{expectation[:canonical]}">)
  next "#{route} does not canonicalize to #{expectation[:canonical]}" unless html.include?(canonical)
  next "#{route} contains a malformed double-slash feature URL" if html.include?("https://brenorb.com//assets/")

  if expectation[:redirect]
    refresh = %(http-equiv="refresh" content="0; url=#{expectation[:canonical]}")
    next "#{route} is missing its redirect to #{expectation[:canonical]}" unless html.include?(refresh)
    next "#{route} redirect must be noindex" unless html.include?(%(<meta name="robots" content="noindex">))
  end

  nil
end

content_routes.each do |route|
  output_path = File.join(site_dir, route.delete_prefix("/"), "index.html")
  unless File.file?(output_path)
    errors << "#{route} was not generated at #{output_path}"
    next
  end

  html = File.read(output_path)
  errors << "#{route} is missing article:modified_time" unless html.include?("property=\"article:modified_time\"")
  errors << "#{route} is missing Article dateModified schema" unless html.include?("\"dateModified\"")
  errors << "#{route} is missing a related-pages section" unless html.include?("class=\"related-posts\"")
  errors << "#{route} contains a malformed double-slash feature URL" if html.include?("https://brenorb.com//assets/")
end

intentional_noindex_routes.each do |route, expectation|
  output_path = File.join(site_dir, expectation[:output_path])
  unless File.file?(output_path)
    errors << "#{route} was not generated at #{output_path}"
    next
  end

  html = File.read(output_path)
  canonical = %(<link rel="canonical" href="#{expectation[:canonical]}">)
  errors << "#{route} does not canonicalize to #{expectation[:canonical]}" unless html.include?(canonical)
  errors << "#{route} is missing its intentional noindex directive" unless html.match?(%r{<meta name="robots" content="noindex(?:,follow)?">})

  if expectation[:redirect]
    refresh = %(http-equiv="refresh" content="0; url=#{expectation[:canonical]}")
    errors << "#{route} is missing its redirect to #{expectation[:canonical]}" unless html.include?(refresh)
  end
end

canonical_project_routes.each do |route|
  output_path = File.join(site_dir, route.delete_prefix("/"), "index.html")
  unless File.file?(output_path)
    errors << "#{route} was not generated at #{output_path}"
    next
  end

  html = File.read(output_path)
  errors << "#{route} is missing its self-canonical URL" unless html.include?(%(<link rel="canonical" href="https://brenorb.com#{route}">))
  errors << "#{route} must not be noindex" if html.match?(%r{<meta name="robots" content="noindex})
  errors << "#{route} is missing from the projects archive" unless File.read(File.join(site_dir, "projects/index.html")).include?("https://brenorb.com#{route}")
  errors << "#{route} is missing from the sitemap" unless File.read(File.join(site_dir, "sitemap.xml")).include?("<loc>https://brenorb.com#{route}</loc>")
end

errors.concat(post_route_errors)

english_routes.each do |route|
  output_path = File.join(site_dir, route.delete_prefix("/"), "index.html")
  unless File.file?(output_path)
    errors << "#{route} was not generated at #{output_path}"
    next
  end

  html = File.read(output_path)
  errors << "#{route} must declare lang=\"en\"" unless html.match?(%r{<html[^>]+lang="en"})
end

html_files = Dir[File.join(site_dir, "**", "*.html")]
html_files.each do |output_path|
  html = File.read(output_path)
  html_lang = html[/<html[^>]+lang="([^"]+)"/, 1]
  errors << "#{output_path} is missing an html lang attribute" unless html_lang

  robots = html[/<meta name="robots" content="([^"]+)"/, 1]
  next if robots&.include?("noindex")

  if html_lang
    expected_locale = html_lang.start_with?("en") ? "en_US" : html_lang.tr("-", "_")
    errors << "#{output_path} has the wrong Open Graph locale" unless html.include?(%(<meta property="og:locale" content="#{expected_locale}">))
  end

  errors << "#{output_path} has an image without alt text" if html.scan(/<img\b[^>]*>/).any? { |tag| tag !~ /\balt="[^"]*\S[^"]*"/ }
end

home = File.join(site_dir, "index.html")
errors << "homepage must contain exactly one h1" unless File.read(home).scan(/<h1\b/).length == 1

contact_success = File.join(site_dir, "contact-success/index.html")
contact_success_html = File.read(contact_success)
errors << "contact-success must be noindex" unless contact_success_html.include?(%(<meta name="robots" content="noindex,follow">))

if errors.any?
  warn errors.join("\n")
  exit 1
end

puts "Verified #{checks.length + content_routes.length + intentional_noindex_routes.length + canonical_project_routes.length} Google indexing routes."
