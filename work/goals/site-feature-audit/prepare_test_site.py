#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[3]
SITE_DIR = REPO_ROOT / "_site_goaltest"
CONTACT_HTML = SITE_DIR / "contact" / "index.html"
LIGHTBOX_FIXTURE = SITE_DIR / "lightbox-fixture.html"
TWITTER_FIXTURE = SITE_DIR / "twitter-fixture.html"


def patch_contact_form() -> None:
    content = CONTACT_HTML.read_text()
    original = 'action="https://formspree.io/f/mzbnldqd"'
    replacement = 'action="/mock-form"'
    if original in content:
        content = content.replace(original, replacement, 1)
        CONTACT_HTML.write_text(content)


def write_lightbox_fixture() -> None:
    LIGHTBOX_FIXTURE.write_text(
        """<!DOCTYPE html>
<html class="no-js">
<head>
  <meta charset="utf-8">
  <title>Lightbox Fixture</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/assets/css/main.css">
  <script src="/assets/js/modernizr-3.3.1.custom.min.js"></script>
</head>
<body>
  <div class="wrapper animated fadeIn">
    <div class="content">
      <div class="post-title">
        <h1>Lightbox Fixture</h1>
      </div>
      <p>Fixture page for the Magnific Popup image flow.</p>
      <a href="/assets/generated/granola-calle-social-proof.png">
        <img src="/assets/generated/granola-calle-social-proof.png" alt="Granola screenshot" width="640">
      </a>
    </div>
  </div>
  <script src="/assets/js/jquery-1.12.0.min.js"></script>
  <script src="/assets/js/jquery.dlmenu.min.js"></script>
  <script src="/assets/js/jquery.goup.min.js"></script>
  <script src="/assets/js/jquery.magnific-popup.min.js"></script>
  <script src="/assets/js/jquery.fitvid.min.js"></script>
  <script src="/assets/js/scripts.js"></script>
</body>
</html>
""",
        encoding="utf-8",
    )


def write_twitter_fixture() -> None:
    TWITTER_FIXTURE.write_text(
        """<!DOCTYPE html>
<html class="no-js">
<head>
  <meta charset="utf-8">
  <title>Twitter Fixture</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/assets/css/main.css">
  <script src="/assets/js/modernizr-3.3.1.custom.min.js"></script>
</head>
<body>
  <div class="wrapper animated fadeIn">
    <div class="content">
      <div class="post-title">
        <h1>Twitter Fixture</h1>
      </div>
      <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr">just a test tweet embed fixture</p>
        &mdash; OpenAI (@OpenAI)
        <a href="https://twitter.com/OpenAI/status/1765396941900443699">March 5, 2024</a>
      </blockquote>
    </div>
  </div>
  <script src="/assets/js/jquery-1.12.0.min.js"></script>
  <script src="/assets/js/jquery.dlmenu.min.js"></script>
  <script src="/assets/js/jquery.goup.min.js"></script>
  <script src="/assets/js/jquery.magnific-popup.min.js"></script>
  <script src="/assets/js/jquery.fitvid.min.js"></script>
  <script src="/assets/js/scripts.js"></script>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</body>
</html>
""",
        encoding="utf-8",
    )


def main() -> None:
    if not SITE_DIR.exists():
        raise SystemExit(f"Missing build directory: {SITE_DIR}")
    patch_contact_form()
    write_lightbox_fixture()
    write_twitter_fixture()
    print("Prepared _site_goaltest with audit fixtures and a local contact-form POST target.")


if __name__ == "__main__":
    main()
