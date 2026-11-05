# frozen_string_literal: true

# Adds loading="lazy" and decoding="async" to images in the page body so
# off-screen images (and the photo inside the closed navigation menu) don't
# delay the page load. The home page avatar (.img-circle) stays eager.
module LazyImages
  module_function

  def transform(output)
    head_end = output.index('</head>')
    return output unless head_end

    body = output[head_end..].gsub(/<img\b[^>]*>/i) do |tag|
      next tag if tag.match?(/\sloading=/i) || tag.include?('img-circle')

      attrs = ' loading="lazy"'
      attrs += ' decoding="async"' unless tag.match?(/\sdecoding=/i)
      tag.sub(/<img\b/i, "<img#{attrs}")
    end
    output[0...head_end] + body
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.respond_to?(:output) && doc.output_ext == '.html' && doc.output

  doc.output = LazyImages.transform(doc.output)
end
