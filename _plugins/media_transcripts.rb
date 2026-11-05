# frozen_string_literal: true

# Publishes each media transcript (_data/media_appendices/<slug>.json) as a
# plain-text file next to its post, e.g. /media/<slug>/transcript/<item>.txt.
#
# Transcripts can be hundreds of kilobytes of HTML, which made media pages slow
# to parse. The post now links to the text file, and assets/js/scripts.js
# fetches and renders it when the reader opens the transcript.
#
# Line format (parsed by scripts.js; keep both in sync):
#   [mm:ss](https://source?t=123) **Speaker:** text
# The link and the speaker are optional.
module MediaTranscripts
  module_function

  def url_for(post, item)
    "#{post.url.sub(%r{/?\z}, '/')}transcript/#{item['id']}.txt"
  end

  def line_for(line)
    stamp = "[#{line['timestamp']}]"
    stamp += "(#{line['href']})" if line['href'] && !line['href'].empty?
    speaker = line['speaker'] && !line['speaker'].empty? ? " **#{line['speaker']}:**" : ''
    "#{stamp}#{speaker} #{line['text'].to_s.gsub(/\s+/, ' ').strip}"
  end

  def text_for(site, post, item)
    header = [
      post.data['title'].to_s,
      item['label'].to_s,
      ("Fonte: #{item['source_label']} #{item['source_url']}".strip if item['source_url']),
      "Página: #{site.config['url']}#{post.url}",
    ].compact
    "#{header.join("\n")}\n\n#{Array(item['lines']).map { |line| line_for(line) }.join("\n")}\n"
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      appendices = site.data['media_appendices'] || {}
      site.posts.docs.each do |post|
        appendix = appendices[post.data['slug']]
        next unless appendix && appendix['items'].is_a?(Array)
        next if post.data['show_transcript'] == false

        appendix['items'].each do |item|
          next if Array(item['lines']).empty?

          url = MediaTranscripts.url_for(post, item)
          page = Jekyll::PageWithoutAFile.new(site, site.source, File.dirname(url), File.basename(url))
          page.content = MediaTranscripts.text_for(site, post, item)
          page.data['layout'] = nil
          page.data['sitemap'] = false
          page.data['render_with_liquid'] = false
          site.pages << page
        end
      end
    end
  end
end
