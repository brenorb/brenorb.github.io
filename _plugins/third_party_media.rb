# frozen_string_literal: true

# Keeps third-party media off the critical path of page loads.
#
# - Remote <img> and <video poster> URLs use a self-hosted copy from
#   assets/remote/ when one exists (scripts/self_host_remote_media.rb downloads
#   them). Without a copy, the image loads right after the page has loaded
#   (assets/js/scripts.js), with a <noscript> fallback.
# - Third-party iframes other than YouTube (see lite_youtube.rb) become a link
#   that loads the real iframe on click.
require 'cgi'
require 'digest'

module ThirdPartyMedia
  IMAGE_EXTENSIONS = %w[.png .jpg .jpeg .gif .webp .svg .avif].freeze

  module_function

  def site_hosts(site)
    url = site.config['url'].to_s
    host = url.sub(%r{\Ahttps?://}, '').split('/').first
    [host].compact
  end

  def remote?(site, url)
    return false unless url.match?(%r{\A(https?:)?//}i)

    host = url.sub(%r{\A(https?:)?//}i, '').split(%r{[/?#]}).first.to_s.downcase
    !site_hosts(site).include?(host)
  end

  # Local file name for a remote URL; shared with scripts/self_host_remote_media.rb.
  def local_name(url)
    path = url.split(/[?#]/).first.to_s
    ext = File.extname(path).downcase
    query = url[/[?&]format=(\w+)/, 1]
    ext = ".#{query.downcase}" if query
    ext = '.img' unless IMAGE_EXTENSIONS.include?(ext)
    "#{Digest::SHA256.hexdigest(url)[0, 20]}#{ext}"
  end

  def local_copy(site, url)
    return nil unless url.is_a?(String) && remote?(site, url)

    name = local_name(CGI.unescapeHTML(url))
    File.exist?(File.join(site.source, 'assets', 'remote', name)) ? "/assets/remote/#{name}" : nil
  end

  def transform_img(site, tag)
    src = tag[/\ssrc="([^"]+)"/, 1]
    return tag unless src && remote?(site, src)

    local = local_copy(site, src)
    return tag.sub(/\ssrc="[^"]+"/, %( src="#{site.config['baseurl']}#{local}")) if local
    return tag if tag.include?('data-deferred-src')

    deferred = tag.sub(/\ssrc="([^"]+)"/, ' data-deferred-src="\1"')
    deferred = deferred.sub(/<img\b/, '<img loading="lazy" decoding="async"') unless deferred.include?('loading=')
    "#{deferred}<noscript>#{tag}</noscript>"
  end

  def transform_video(site, tag)
    poster = tag[/\sposter="([^"]+)"/, 1]
    return tag unless poster && remote?(site, poster)

    local = local_copy(site, poster)
    return tag.sub(/\sposter="[^"]+"/, %( poster="#{site.config['baseurl']}#{local}")) if local

    tag.sub(/\sposter="([^"]+)"/, ' data-deferred-poster="\1"')
  end

  def transform_iframe(site, match)
    attrs = match[:attrs]
    src = attrs[/\ssrc="([^"]+)"/, 1]
    return match[0] unless src && remote?(site, src)

    title = attrs[/\stitle="([^"]*)"/, 1]
    height = attrs[/\sheight="(\d+)"/, 1]
    label, link = if src.include?('open.spotify.com/embed/')
                    ['Ouvir no Spotify', src.sub('/embed/', '/').sub(/\?.*\z/, '')]
                  else
                    [title && !title.empty? ? title : 'Abrir conteúdo incorporado', src]
                  end
    style = height ? %( style="min-height:#{height.to_i}px") : ''
    iframe_attrs = attrs.sub(/\sloading="[^"]*"/, '')
    <<~HTML.gsub(/\n\s*/, '')
      <span class="embed-facade" data-lite-iframe data-iframe-attrs="#{CGI.escapeHTML(iframe_attrs.strip)}"#{style}>
        <a class="embed-facade__link" href="#{link}">#{CGI.escapeHTML(CGI.unescapeHTML(label))}</a>
      </span>
    HTML
  end

  def transform(doc)
    output = doc.output
    return unless output

    site = doc.site
    # Leave <head> alone (meta tags and structured data are not fetched).
    head_end = output.index('</head>') || 0
    head = output[0...head_end]
    body = output[head_end..]
    body = body.gsub(/<img\b[^>]*>/i) { |tag| transform_img(site, tag) }
    body = body.gsub(/<video\b[^>]*>/i) { |tag| transform_video(site, tag) }
    body = body.gsub(%r{<iframe\b(?<attrs>[^>]*)>\s*</iframe>}im) { transform_iframe(site, Regexp.last_match) }
    doc.output = head + body
  end
end

# Liquid filter: `{{ url | local_copy }}` returns the self-hosted copy of a
# remote URL when one exists, otherwise the URL unchanged.
module ThirdPartyMediaFilter
  def local_copy(url)
    ThirdPartyMedia.local_copy(@context.registers[:site], url) || url
  end
end
Liquid::Template.register_filter(ThirdPartyMediaFilter)

# Runs after lite_youtube.rb has replaced YouTube iframes (plugins load in
# alphabetical order, and hooks run in registration order).
Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  ThirdPartyMedia.transform(doc) if doc.respond_to?(:output) && doc.output_ext == '.html'
end
