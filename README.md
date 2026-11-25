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

Podcast posts (`content_type: media`, `category: podcast`) must include an embedded player, source metadata (`youtube_id` or `media_url`), a transcript manifest entry, and generated chapter navigation. Podcasts are detected by category, tags, filename or title so omitting the category cannot bypass validation. The same coverage checks also apply to other posts with embedded players or declared media sources. These checks run in pre-commit, CI, and the deployment workflow; a failure blocks publication:

```bash
node scripts/check_media_sources.js
node scripts/verify_media_transcripts.js
node --test scripts/check_media_sources.test.js scripts/media_chapters.test.js
```

Audit post metadata coverage:

```bash
ruby scripts/audit_post_metadata.rb
```

## Semantic related pages

Related pages use [Multilingual E5 Small](https://huggingface.co/intfloat/multilingual-e5-small), with [quantized ONNX weights](https://huggingface.co/Xenova/multilingual-e5-small) and Transformers.js. The model revision and runtime version are pinned in `scripts/build_related_posts.mjs` and `package-lock.json`.

The generator indexes public posts across articles, media and projects. It embeds the title and summary separately from the body and curated chapter titles, giving the summary and body equal weight. Long text is covered by overlapping windows of 384 tokens with 48 tokens of overlap. E5's `query: ` prefix is used for this symmetric similarity task. Each page gets the three other pages with the smallest cosine distance, `1 - cosine_similarity`; dates and tag overlap do not affect the ranking. Equal distances are ordered by canonical URL.

Install the generation dependency and rebuild recommendations:

```bash
npm ci
npm run build:related
```

The first regeneration downloads the quantized model into the ignored `.cache/related-posts/` directory. Later runs reuse the committed vectors in `scripts/data/related_embeddings.json` and only embed pages whose title, summary, body or chapter text changed. Recommendations and distances are stored in `_data/related_posts.json`. Visitors receive ordinary static links; the model runs locally during generation.

Pre-commit regenerates the index and runs its regression tests. CI and deployment validate the source hashes, vectors and nearest-neighbor ranking without downloading or running the model. They reject stale recommendations before publication, and check the rendered links after Jekyll builds the site:

```bash
npm run check:related
npm run test:related
ruby scripts/check_related_posts.rb
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

Verify podcast format and transcript manifest coverage for every podcast, post with an embedded player, and `media` post with a declared source:

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
- `scripts/check_media_sources.js` requires embedded players on podcasts and verifies media manifest coverage and generated chapter navigation.
- `scripts/check_media_sources.test.js` guards against link-only podcasts bypassing validation, with or without source metadata.
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
