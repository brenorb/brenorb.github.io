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

content_routes = %w[
  /palestra-introducao-a-opcoes/
  /podcast-stealth-fountain/
  /podcast-bipa-cast-22-101-perguntas-sobre-bitcoin/
  /podcast-fernando-caixeta-101-perguntas-sobre-bitcoin/
  /podcast-bipa-cast-38-satsconf/
  /podcast-sessao-de-hopium-ep-20/
  /ordinals-devem-ser-banidos/
  /podcast-explica-bitcoin-ia-fim-da-historia-humana/
  /podcast-criptoverso-54-breno-brito/
  /os-7-fundamentos-do-maximalismo-do-bitcoin/
]

intentional_noindex_routes = {
  "/projects/fast-transcript/" => {
    output_path: "projects/fast-transcript/index.html",
    canonical: "https://brenorb.com/project/fast-transcript/",
    redirect: true
  },
  "/projects/docs2epub/" => {
    output_path: "projects/docs2epub/index.html",
    canonical: "https://brenorb.com/project/docs2epub/",
    redirect: true
  },
  "/projects/lkdn/" => {
    output_path: "projects/lkdn/index.html",
    canonical: "https://brenorb.com/project/lkdn/",
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
  /project/fast-transcript/
  /project/docs2epub/
  /project/lkdn/
]

english_routes = %w[
  /about/
  /role-bitcoin-gen-ai/
  /project/bip39-portuguese-wordlist/
  /project/bitchat-cli/
  /project/bitdevs-brasilia/
  /project/btc-graph/
  /project/docs2epub/
  /project/fast-transcript/
  /project/filepizza-cli/
  /project/fran/
  /project/freedom-skills/
  /project/granola/
  /project/lkdn/
  /project/minimaxis/
  /project/nowhere-cli/
  /project/portfolio-optimization-thesis/
  /project/reinforcement-learning-financial-markets-thesis/
  /project/satoshi-7b/
  /project/stealth/
  /project/stringer-safety/
]

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
  errors << "#{output_path} is missing an html lang attribute" unless html.match?(%r{<html[^>]+lang="[^"]+"})

  robots = html[/<meta name="robots" content="([^"]+)"/, 1]
  next if robots&.include?("noindex")

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
