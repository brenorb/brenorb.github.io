# frozen_string_literal: true

# Preloads the extra font files a page will need (monospace, italic), so they
# download in parallel with the stylesheet instead of after the first layout.
# Fonts discovered late push the load event behind the first rendered frame.
# _includes/head.html already preloads Fira Sans Regular, Bold and Light.
module PreloadFonts
  FONTS = {
    inconsolata: '/assets/fonts/Inconsolata/Inconsolata-latin.woff2',
    italic: '/assets/fonts/FiraSans/woff2-latin/FiraSans-Italic.woff2',
    bold_italic: '/assets/fonts/FiraSans/woff2-latin/FiraSans-BoldItalic.woff2',
  }.freeze

  # Elements styled with Inconsolata ($font2 in _sass).
  MONOSPACE = /<(?:code|pre|kbd|samp)\b|class="[^"]*\b(?:highlight|contact-card-label|contact-info|contact-success-link)\b/i.freeze
  # Italic text, ignoring <i class="fa ..."> icons.
  ITALIC = /<(?:em|cite|dfn|var|address)\b|<i\b(?![^>]*\bfa\b)/i.freeze
  BOLD_ITALIC = %r{<(strong|b|h[1-6])\b[^>]*>(?:(?!</\1>).){0,400}?<(?:em|i)\b(?![^>]*\bfa\b)|<(em|i)\b(?![^>]*\bfa\b)[^>]*>(?:(?!</\2>).){0,400}?<(?:strong|b)\b}im.freeze
  ANCHOR = 'FiraSans-Light.woff2" as="font" type="font/woff2" crossorigin>'

  module_function

  def needed(body)
    needed = []
    needed << :inconsolata if body.match?(MONOSPACE)
    needed << :italic if body.match?(ITALIC)
    needed << :bold_italic if body.match?(BOLD_ITALIC)
    needed
  end

  def transform(site, output)
    head_end = output.index('</head>')
    anchor = output.index(ANCHOR)
    return output unless head_end && anchor && anchor < head_end

    body = output[head_end..].gsub(%r{<script\b.*?</script>|<noscript\b.*?</noscript>}im, '')
    links = needed(body).map do |font|
      href = "#{site.config['baseurl']}#{FONTS[font]}"
      %(<link rel="preload" href="#{href}" as="font" type="font/woff2" crossorigin>)
    end
    return output if links.empty?

    insert_at = anchor + ANCHOR.length
    output.dup.insert(insert_at, links.join)
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.respond_to?(:output) && doc.output_ext == '.html' && doc.output

  doc.output = PreloadFonts.transform(doc.site, doc.output)
end
