# frozen_string_literal: true

# Inlines the site stylesheet and script into every HTML page.
#
# Both are small (about 14 KB and 5 KB gzipped). Inlining removes two requests
# from the critical path, so the page can render and finish loading without
# waiting for them. The trade-off is that they are not cached across pages,
# which matters little for a site most visitors reach one page at a time.
# The standalone files are still published (feeds, old cached pages).
module InlineAssets
  STYLESHEET = %r{<link rel="stylesheet" href="(?<base>[^"]*)/assets/css/main\.css">}.freeze
  SCRIPT = %r{<script src="[^"]*/assets/js/scripts\.js" defer></script>}.freeze

  module_function

  def stylesheet(site)
    page = site.pages.find { |p| p.url == '/assets/css/main.css' }
    return nil unless page&.output

    baseurl = site.config['baseurl'].to_s
    page.output
        .delete_prefix("\uFEFF") # Sass adds a byte-order mark; it would break the first rule.
        .sub(%r{/\*# sourceMappingURL=[^*]*\*/\s*\z}, '')
        # Relative URLs in the stylesheet point at /assets/; make them absolute.
        .gsub(/url\((["']?)\.\.\//) { "url(#{Regexp.last_match(1)}#{baseurl}/assets/" }
        .strip
  end

  def script(site)
    js = File.read(File.join(site.source, 'assets', 'js', 'scripts.js'), encoding: 'UTF-8')
    raise 'assets/js/scripts.js must not contain "</script"' if js.match?(%r{</script}i)

    js.strip
  end

  def inline(output, css, js)
    return output unless output.match?(STYLESHEET) || output.match?(SCRIPT)

    output = output.sub(STYLESHEET) { "<style>#{css}</style>" } if css
    if js && output.match?(SCRIPT) && output.include?('</body>')
      output = output.sub(SCRIPT, '')
      # At the end of <body> the inline script runs once the page is parsed,
      # like the deferred external script did.
      index = output.rindex('</body>')
      output = output[0...index] + "<script>#{js}</script>" + output[index..]
    end
    output
  end
end

Jekyll::Hooks.register :site, :post_render do |site|
  css = InlineAssets.stylesheet(site)
  js = InlineAssets.script(site)
  (site.pages + site.documents).each do |doc|
    next unless doc.respond_to?(:output) && doc.output && doc.output_ext == '.html'

    doc.output = InlineAssets.inline(doc.output, css, js)
  end
end
