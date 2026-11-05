#!/usr/bin/env bash
# Source checks that run before a build, plus regeneration of committed
# generated files. Used by the pre-commit hook and CI; afterwards, callers
# either stage (hook) or diff (CI) the generated paths listed below.
#
# Generated paths: _includes/generated llms-ctx-full.txt
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "Checking feature image sizes"
ruby scripts/check_feature_images.rb

echo "Verifying embedded media post coverage"
node scripts/check_media_sources.js

echo "Verifying transcript coverage"
node scripts/verify_media_transcripts.js

echo "Regenerating topic chapter includes"
node scripts/build_topic_chapters.js

echo "Regenerating llms-ctx-full.txt"
ruby scripts/build-llms-ctx-full.rb
