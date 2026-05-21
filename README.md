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

## Repo notes

- `_config.yml` holds site metadata, SEO fields, and Jekyll settings.
- `scripts/build-llms-ctx-full.rb` regenerates the expanded AI context file.
- `control.sh` provides a small Podman-based workflow for containerized local serving.
