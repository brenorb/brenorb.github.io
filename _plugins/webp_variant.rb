# frozen_string_literal: true

# Liquid filter: `{{ "/assets/foo.png" | webp_variant }}` returns
# "/assets/foo.webp" when that file exists in the site source (see
# scripts/build_feature_webp.rb), otherwise the path unchanged.
module WebpVariant
  def self.lookup(site, path)
    return path unless path.is_a?(String) && path.match?(/\.(png|jpe?g)\z/i)
    return path if path.match?(%r{\A(https?:)?//})

    webp = path.sub(/\.(png|jpe?g)\z/i, '.webp')
    File.exist?(File.join(site.source, webp.delete_prefix('/'))) ? webp : path
  end

  def webp_variant(path)
    WebpVariant.lookup(@context.registers[:site], path)
  end
end

Liquid::Template.register_filter(WebpVariant)
