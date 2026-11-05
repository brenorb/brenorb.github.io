# frozen_string_literal: true

# WebP copies of local JPEG/PNG images (made by scripts/build_webp_images.rb).
#
# - Liquid filter: `{{ "/assets/foo.png" | webp_variant }}` returns
#   "/assets/foo.webp" when that file exists, otherwise the path unchanged.
# - Page bodies: local <img src="....png|jpg"> with a WebP copy are wrapped in
#   <picture> so browsers download the smaller file; the original stays as the
#   fallback.
module WebpVariant
  def self.lookup(site, path)
    return path unless path.is_a?(String) && path.match?(/\.(png|jpe?g)\z/i)
    return path if path.match?(%r{\A(https?:)?//})

    baseurl = site.config['baseurl'].to_s
    relative = baseurl.empty? ? path : path.delete_prefix(baseurl)
    webp = relative.sub(/\.(png|jpe?g)\z/i, '.webp')
    return path unless File.exist?(File.join(site.source, webp.delete_prefix('/')))

    path.sub(/\.(png|jpe?g)\z/i, '.webp')
  end

  def self.picture(site, tag)
    src = tag[/\ssrc="([^"]+)"/, 1]
    return tag unless src&.start_with?('/') && !src.start_with?('//')

    webp = lookup(site, src)
    return tag if webp == src

    %(<picture><source srcset="#{webp}" type="image/webp">#{tag}</picture>)
  end

  def self.transform(site, output)
    head_end = output.index('</head>')
    return output unless head_end

    # Leave existing <picture> and <noscript> blocks alone.
    parts = output[head_end..].split(%r{(<picture\b.*?</picture>|<noscript\b.*?</noscript>)}im)
    body = parts.each_with_index.map do |part, index|
      index.odd? ? part : part.gsub(/<img\b[^>]*>/i) { |tag| picture(site, tag) }
    end.join
    output[0...head_end] + body
  end

  def webp_variant(path)
    WebpVariant.lookup(@context.registers[:site], path)
  end
end

Liquid::Template.register_filter(WebpVariant)

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.respond_to?(:output) && doc.output_ext == '.html' && doc.output

  doc.output = WebpVariant.transform(doc.site, doc.output)
end
