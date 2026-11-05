#!/usr/bin/env bash
# Builds the small WOFF2 font subsets the site loads by default.
# Requires fonttools with brotli: pip install fonttools brotli
#
# - Fira Sans: per face, a Latin subset used on every page, a small Latin
#   Extended-A subset, and an "other" subset (Greek, Cyrillic, symbols). Browsers
#   only download the last two when a page uses one of those characters (see
#   unicode-range in _sass/vendor/fonts.scss). Emoji are left to system fonts.
# - Inconsolata: self-hosted Latin subset (400, 700) instead of Google Fonts.
# - Font Awesome 4.7: only the icons referenced by the templates.
set -euo pipefail
cd "$(dirname "$0")/.."

LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21AA,U+2212,U+2215,U+FEFF,U+FFFD"

# Keep these in sync with the unicode-range of the faces in fonts.scss.
LATIN_EXT="U+0100-0130,U+0132-0151,U+0154-017F"
OTHER="U+0180-02BA,U+02BD-02C5,U+02C7-02D9,U+02DB,U+02DD-0303,U+0305-0307,U+0309-0328,U+032A-052F,U+1D00-1FFF,U+2070-2073,U+2075-209F,U+20A0-20AB,U+20AD-20CF,U+2100-2121,U+2123-218F,U+21AB-21FF,U+2200-2211,U+2213-2214,U+2216-23FF,U+25A0-25FF,U+27A0-27BF,U+2B00-2BFF,U+2C60-2C7F,U+A720-A7FF,U+AB30-AB6F,U+FB00-FB4F"

FEATURES='kern,liga,clig,calt,ccmp,locl,mark,mkmk'
for subset in latin latin-ext other; do
  mkdir -p "assets/fonts/FiraSans/woff2-${subset}"
done
rm -rf assets/fonts/FiraSans/woff2-extended assets/fonts/FiraSans/woff2-greek-cyrillic
for face in Light LightItalic Regular Italic Medium MediumItalic Bold BoldItalic; do
  for subset in latin latin-ext other; do
    case "${subset}" in
      latin) unicodes="${LATIN}" ;;
      latin-ext) unicodes="${LATIN_EXT}" ;;
      other) unicodes="${OTHER}" ;;
    esac
    pyftsubset "assets/fonts/FiraSans/ttf/FiraSans-${face}.ttf" \
      --unicodes="${unicodes}" --layout-features="${FEATURES}" \
      --flavor=woff2 --output-file="assets/fonts/FiraSans/woff2-${subset}/FiraSans-${face}.woff2"
  done
done

# Font Awesome icons used in _includes/ and _layouts/ (fa-angle-right is used by the nav CSS).
FA_ICONS="f053,f017,f1cb,f17d,f199,f082,f16e,f180,f09b,f0d4,f1d4,f015,f16d,f084,f0eb,f08c,f23a,f001,f0d2,f1be,f16c,f1b7,f174,f081,f18a,f169,f167,f166,f105"
pyftsubset assets/fonts/FontAwesome/fontawesome-webfont.ttf \
  --unicodes="${FA_ICONS}" --flavor=woff2 \
  --output-file=assets/fonts/FontAwesome/fontawesome-subset.woff2
