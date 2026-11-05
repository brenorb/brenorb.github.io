#!/usr/bin/env bash
# Builds the small WOFF2 font subsets the site loads by default.
# Requires fonttools with brotli: pip install fonttools brotli
#
# - Fira Sans: a Latin subset per face. The full WOFF2 files stay in place and
#   are only downloaded for characters outside this range (see fonts.scss).
# - Inconsolata: self-hosted Latin subset (400, 700) instead of Google Fonts.
# - Font Awesome 4.7: only the icons referenced by the templates.
set -euo pipefail
cd "$(dirname "$0")/.."

LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21AA,U+2212,U+2215,U+FEFF,U+FFFD"

mkdir -p assets/fonts/FiraSans/woff2-latin
for face in Light LightItalic Regular Italic Medium MediumItalic Bold BoldItalic; do
  pyftsubset "assets/fonts/FiraSans/ttf/FiraSans-${face}.ttf" \
    --unicodes="${LATIN}" --layout-features='kern,liga,clig,calt,ccmp,locl,mark,mkmk' \
    --flavor=woff2 --output-file="assets/fonts/FiraSans/woff2-latin/FiraSans-${face}.woff2"
done

# Font Awesome icons used in _includes/ and _layouts/ (fa-angle-right is used by the nav CSS).
FA_ICONS="f053,f017,f1cb,f17d,f199,f082,f16e,f180,f09b,f0d4,f1d4,f015,f16d,f084,f0eb,f08c,f23a,f001,f0d2,f1be,f16c,f1b7,f174,f081,f18a,f169,f167,f166,f105"
pyftsubset assets/fonts/FontAwesome/fontawesome-webfont.ttf \
  --unicodes="${FA_ICONS}" --flavor=woff2 \
  --output-file=assets/fonts/FontAwesome/fontawesome-subset.woff2
