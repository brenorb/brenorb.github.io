# frozen_string_literal: true

# Replaces YouTube <iframe> embeds with a lightweight click-to-play placeholder.
#
# A YouTube iframe pulls in roughly a megabyte of third-party scripts and delays
# the page load event even if nobody presses play. The placeholder is a link to
# the video with a poster image; assets/js/scripts.js swaps in the real iframe
# (with autoplay) on click, and chapter timestamps still seek the video.
#
# Poster image, in order of preference:
#   1. assets/img/youtube/<id>.webp (see scripts/fetch_youtube_thumbnails.rb)
#   2. the page's own local `feature` image
#   3. YouTube's thumbnail, fetched by scripts.js after the page has loaded
require 'cgi'

module LiteYouTube
  IFRAME = %r{<iframe\b(?<attrs>[^>]*?)\bsrc="(?<src>https://www\.youtube(?:-nocookie)?\.com/embed/(?<id>[A-Za-z0-9_-]{11})[^"]*)"(?<rest>[^>]*)>\s*</iframe>}m.freeze

  module_function

  def attr(attrs, name)
    match = attrs.match(/\b#{name}="([^"]*)"/)
    match && match[1]
  end

  def local_feature(doc)
    feature = doc.data['feature'].to_s
    site_url = doc.site.config['url'].to_s
    feature = feature.delete_prefix(site_url) if !site_url.empty? && feature.start_with?(site_url)
    return nil if feature.empty? || feature.match?(%r{\Ahttps?://})

    feature.start_with?('/') ? feature : "/#{feature}"
  end

  def poster_for(doc, id)
    local = "/assets/img/youtube/#{id}.webp"
    return [local, false] if File.exist?(File.join(doc.site.source, local))

    feature = local_feature(doc)
    return [WebpVariant.lookup(doc.site, feature), false] if feature

    ["https://i.ytimg.com/vi/#{id}/hqdefault.jpg", true]
  end

  def facade(doc, match)
    id = match[:id]
    src = CGI.unescapeHTML(match[:src])
    attrs = "#{match[:attrs]} #{match[:rest]}"
    title = CGI.unescapeHTML(attr(attrs, 'title') || 'YouTube video player')
    title = 'YouTube video' if title.strip.empty? || title == 'YouTube video player'
    poster, deferred = poster_for(doc, id)
    baseurl = doc.site.config['baseurl'].to_s
    poster = "#{baseurl}#{poster}" unless deferred
    poster_attr = deferred ? %(data-deferred-src="#{CGI.escapeHTML(poster)}") : %(src="#{CGI.escapeHTML(poster)}")
    watch = "https://www.youtube.com/watch?v=#{id}"

    # Only phrasing elements: kramdown often places embeds inside a <p>.
    <<~HTML.gsub(/\n\s*/, '')
      <span class="video-embed video-embed--youtube" data-lite-youtube data-embed-src="#{CGI.escapeHTML(src)}" data-title="#{CGI.escapeHTML(title)}">
        <a class="video-embed__link" href="#{watch}" aria-label="#{CGI.escapeHTML("Play video: #{title}")}">
          <img class="video-embed__poster" #{poster_attr} alt="" width="1280" height="720" loading="lazy" decoding="async">
          <span class="video-embed__play" aria-hidden="true"></span>
        </a>
      </span>
    HTML
  end

  def transform(doc)
    return unless doc.output&.include?('youtube')

    doc.output = doc.output.gsub(IFRAME) { facade(doc, Regexp.last_match) }
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  LiteYouTube.transform(doc) if doc.respond_to?(:output) && doc.output_ext == '.html'
end
