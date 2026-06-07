#!/usr/bin/env bash
# pages-deploy.sh — the STANDARD Cloudflare Pages deploy recipe.
#
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ babb.dev constellation deploy spine (mkbabb/deploy)                       ║
# ║ Distilled from speedtest/scripts/deploy.sh (the deploy_frontend portion). ║
# ╚══════════════════════════════════════════════════════════════════════════╝
#
# WHAT IT IS
# ----------
# The one sanctioned way to ship a static SPA / library demo: build, then
# `wrangler pages deploy`. The frontend half of every constellation app that is
# NOT a same-origin-coupled backend uses this (the D-era CF-Pages target). It
# carries the three properties speedtest proved matter:
#   1. PROJECT pre-flight — assert the Pages project slug exists under the
#      active account BEFORE the build, so a wrong slug fails fast instead of
#      404-ing at deploy after a wasted build.
#   2. ROLLBACK-target capture — record the current live deployment ID BEFORE
#      the alias swap, so the operator has a `wrangler pages deployment
#      rollback <id>` target if post-deploy validation fails.
#   3. COMMIT-MESSAGE sanitisation — transliterate the HEAD body to printable
#      ASCII (wrangler 4.x rejects non-printable bytes such as em-dashes — and
#      this codebase uses U+2014 — so the raw body would trip the validator).
#
# SECRET DISCIPLINE
# -----------------
# CLOUDFLARE_API_TOKEN (Pages:Edit + Read) and CLOUDFLARE_ACCOUNT_ID come from
# the env (host shell or GH Actions secret). NEVER committed, NEVER inlined.
#
# Usage:
#   set -a && source .env && set +a && bash cf/pages-deploy.sh
#   # env: PAGES_PROJECT, BUILD_DIR, BUILD_CMD, (optional) PAGES_BRANCH
# ─── HOW AN APP ADOPTS THIS ───────────────────────────────────────────────────
#   Copy to the app's scripts/, set PAGES_PROJECT to the CF project slug
#   (verify with `wrangler pages project list` — the slug is NOT the .pages.dev
#   subdomain), set BUILD_DIR (the artefact dir, e.g. dist) + BUILD_CMD.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ── Configuration (set per app, via env or edit here) ─────────────────────────
: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN (Pages:Edit + Read scope)}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"
PAGES_PROJECT="${PAGES_PROJECT:-keyframes}"      # CF project slug (keyframes-8uq.pages.dev / keyframes.babb.dev)
PAGES_BRANCH="${PAGES_BRANCH:-master}"
BUILD_DIR="${BUILD_DIR:-dist/gh-pages}"          # vite gh-pages mode outDir (the demo SPA)
BUILD_CMD="${BUILD_CMD:-npm run gh-pages}"       # the demo build (mode gh-pages)

log() { printf '\033[0;32m[pages-deploy]\033[0m %s\n' "$1"; }
err() { printf '\033[0;31m[pages-deploy]\033[0m %s\n' "$1" >&2; }

# ── 1. Project pre-flight — fail fast on a wrong/missing slug ─────────────────
log "Pre-flight: confirming Pages project '$PAGES_PROJECT' exists..."
if ! npx --yes wrangler pages project list 2>/dev/null \
    | grep -qE "(^|[[:space:]])${PAGES_PROJECT}([[:space:]]|$)"; then
    err "Pages project '$PAGES_PROJECT' not found under account $CLOUDFLARE_ACCOUNT_ID."
    err "Run \`npx wrangler pages project list\` to see available slugs."
    err "Verify CLOUDFLARE_API_TOKEN scope includes Pages:Read."
    exit 1
fi

# ── 2. Capture the current live deployment ID as the rollback target ──────────
# The first row of `pages deployment list` is the live deployment; its id is the
# `wrangler pages deployment rollback <id> --project-name <slug>` target if the
# new deploy's validation fails. Capture BEFORE the deploy swaps the alias.
log "Recording current live deployment as rollback target..."
ROLLBACK_ID="$(npx --yes wrangler pages deployment list \
    --project-name "$PAGES_PROJECT" --json 2>/dev/null \
    | jq -r '.[0].id // empty' 2>/dev/null || true)"
if [ -n "$ROLLBACK_ID" ]; then
    log "Rollback target: $ROLLBACK_ID"
    log "  recover with: npx wrangler pages deployment rollback $ROLLBACK_ID --project-name $PAGES_PROJECT"
else
    err "Could not capture rollback target (first deploy, or list failed) — read it from the CF dashboard if needed."
fi

# ── 3. Build ──────────────────────────────────────────────────────────────────
log "Building ($BUILD_CMD)..."
eval "$BUILD_CMD"
[ -d "$BUILD_DIR" ] || { err "build dir '$BUILD_DIR' not found after build"; exit 1; }

# ── 4. Sanitise the commit message (wrangler 4.x rejects non-printable bytes) ─
# This codebase uses U+2014 (—) + other Unicode in commit bodies; transliterate
# to printable ASCII so wrangler accepts the message. macOS iconv exits non-zero
# on any TRANSLIT substitution even though stdout is valid, hence the `|| true`.
raw_msg="$(git -C "$ROOT" log -1 --pretty=%B)"
sanitized_msg=""
if command -v iconv >/dev/null 2>&1; then
    sanitized_msg="$(printf '%s' "$raw_msg" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || true)"
fi
if [ -z "${sanitized_msg:-}" ]; then
    sanitized_msg="$(printf '%s' "$raw_msg" | LC_ALL=C tr -cd '\11\12\15\40-\176')"
fi
[ -z "$sanitized_msg" ] && sanitized_msg="$raw_msg"

# ── 5. Deploy ───────────────────────────────────────────────────────────────
log "Deploying $BUILD_DIR → Cloudflare Pages project '$PAGES_PROJECT'..."
npx wrangler pages deploy "$BUILD_DIR" \
    --project-name "$PAGES_PROJECT" \
    --branch "$PAGES_BRANCH" \
    --commit-dirty=true \
    --commit-message "$sanitized_msg"

log "Deployed: https://${PAGES_PROJECT}.pages.dev/ (custom domain per cf/dns-cf-sync.sh)"
