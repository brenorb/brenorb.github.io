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

## Repo notes

- `_config.yml` holds site metadata, SEO fields, and Jekyll settings.
- `scripts/build-llms-ctx-full.rb` regenerates the expanded AI context file.
- `scripts/media_sources.json` is the media manifest for transcript generation.
- `scripts/check_media_sources.js` verifies that every post with an embedded media player is present in the manifest.
- `scripts/verify_media_transcripts.js` verifies that each manifest item has raw transcripts, native script output, and generated appendix data.
- `scripts/transcribe_media_batch.js` runs the frozen `fscript` + diarization flow sequentially and writes both JSON and native `--script` outputs.
- `scripts/build_media_appendices.js` converts raw transcript JSON into `_data/media_appendices/`.
- `control.sh` provides a small Podman-based workflow for containerized local serving.
