# Breno Brito website

Source for https://brenorb.com.

This repo contains Breno Brito's personal site, including:
- articles and notes in `_posts/`
- profile and static pages such as `/about/`, `/projects/`, and `/media/`
- machine-readable crawler context in `llms.txt` and `llms-ctx-full.txt`

## Local development

Requirements:
- Ruby with Bundler
- the gems from `Gemfile`

Install dependencies:

```bash
bundle install
```

Run locally:

```bash
bundle exec jekyll serve
```

Build the site:

```bash
bundle exec jekyll build
```

Verify that the Search Console regression routes exist and point to their canonical pages:

```bash
ruby scripts/check_indexing_routes.rb
```

Install the repo hooks:

```bash
./scripts/install-git-hooks.sh
```

The pre-commit hook and CI both enforce a size limit for local `feature:` images in posts:

```bash
ruby scripts/check_feature_images.rb
```

They also verify that embedded `media` posts are covered by the transcript manifest and wired to generated chapter includes:

```bash
node scripts/check_media_sources.js
```

Audit post metadata coverage:

```bash
ruby scripts/audit_post_metadata.rb
```

## Page speed

Every page should finish loading in under 50 ms under the repeatable test in
`scripts/measure_page_load.js` (cold cache, local HTTPS/HTTP/2 server, every
third-party host answered after a fixed 100 ms delay; see the header of the
script for the exact conditions). Build the site, then measure every page:

```bash
node scripts/measure_page_load.js
```

It prints the median load time per page (5 runs each) and exits non-zero if
any page is at or over the budget. `--only /media/,/about/` limits the run to
matching pages and `--detail` prints each page's resource timeline. It needs
Node.js and Playwright's Chromium.

What keeps pages fast, and what to run when adding content:

- `_plugins/inline_assets.rb` inlines the stylesheet and `assets/js/scripts.js`
  (vanilla JS, no jQuery) into every page.
- `_plugins/preload_fonts.rb` preloads the monospace and italic fonts on pages
  that use them. `scripts/build_font_subsets.sh` builds the font subsets.
- `_plugins/lite_youtube.rb` turns YouTube iframes into click-to-play
  placeholders. After adding a YouTube embed, run
  `ruby scripts/fetch_youtube_thumbnails.rb` to save a local poster (otherwise
  the post's local `feature` image is used).
- `_plugins/webp_variant.rb` serves WebP copies of local images. After adding
  images, run `ruby scripts/build_webp_images.rb`.
- `_plugins/third_party_media.rb` serves self-hosted copies of remote images
  from `assets/remote/` when present (`ruby scripts/self_host_remote_media.rb`
  downloads them) and makes other third-party iframes load on click.
- `_plugins/media_transcripts.rb` publishes transcripts as
  `/<post>/transcript/<id>.txt`; the page loads them when opened.
- Pre-render diagrams instead of loading Mermaid:
  `node scripts/render_mermaid.js <in.mmd> <out.svg>` (needs `npm install --no-save mermaid@11`).

## Media transcript workflow

Generate diarized raw transcripts one item at a time:

```bash
node scripts/transcribe_media_batch.js
```

Regenerate the per-post appendix data used by the site:

```bash
node scripts/build_media_appendices.js
```

That appendix build keeps the raw transcript JSON untouched and only cleans obviously pathological repeated-word runs in the display layer, so lines like `we we we we` render as `we... we`.

Verify that every post with an embedded player is covered by the transcript manifest:

```bash
node scripts/check_media_sources.js
```

Verify that every manifest item has raw JSON, native `--script` output, and appendix data:

```bash
node scripts/verify_media_transcripts.js
```

Regenerate the chapter includes for posts that already have curated chapter specs:

```bash
node scripts/build_topic_chapters.js
```

## Repo notes

- `_config.yml` holds site metadata, SEO fields, and Jekyll settings.
- `scripts/audit_post_metadata.rb` reports missing post metadata such as `description`, `excerpt`, `tags`, and `feature`.
- `scripts/build-llms-ctx-full.rb` regenerates the expanded AI context file.
- `scripts/media_sources.json` is the media manifest for transcript generation.
- `scripts/check_media_sources.js` verifies that embedded `media` posts are present in the manifest and include generated chapter navigation.
- `scripts/topic_chapters.json` is the curated chapter source of truth for `media` posts.
- `scripts/build_topic_chapters.js` renders those curated chapters into `_includes/generated/`.
- `scripts/verify_media_transcripts.js` verifies that each manifest item has raw transcripts, native script output, generated appendix data, and published diarization metadata.
- `scripts/transcribe_media_batch.js` runs the frozen `fscript` + diarization flow sequentially and writes both JSON and native `--script` outputs.
- `scripts/build_media_appendices.js` converts raw transcript JSON into `_data/media_appendices/`.
- `control.sh` provides a small Podman-based workflow for containerized local serving.

## Metadata standard

For new posts, use this minimum front matter baseline:

- `title`
- `excerpt`
- `description`
- `tags`
- `feature` for shareable pages and posts

Use `content_type` when the post should render outside the default writing archive, especially for `media` and `project` entries.
