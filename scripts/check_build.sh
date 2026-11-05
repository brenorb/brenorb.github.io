#!/usr/bin/env bash
# Checks on the built site. Usage: scripts/check_build.sh [site_dir]
set -euo pipefail
repo_root="$(git rev-parse --show-toplevel)"
# Resolve the site dir from the caller's directory before moving to the repo root.
site_dir="$(cd "${1:-$repo_root/_site}" && pwd)"
cd "$repo_root"

echo "Verifying Google indexing routes"
ruby scripts/check_indexing_routes.rb "$site_dir"

echo "Verifying related page relevance"
ruby scripts/check_related_posts.rb "$site_dir"

echo "Verifying head metadata"
ruby scripts/check_head_meta.rb "$site_dir"

echo "Verifying internal links"
ruby scripts/check_internal_links.rb "$site_dir"
