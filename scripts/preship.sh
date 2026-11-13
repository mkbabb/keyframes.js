#!/usr/bin/env bash
# preship.sh — the browser checks, run on the workstation before a ship.
#
# Owner order 2026-11-13: no Playwright in any GitHub Action. ci.yml runs the
# cheap gates (types, build, the jsdom suites, lint, publish boundary). What
# used to run in the `demo correctness (browser roster)` job runs here, each
# lane in its own `guarded` call.
#
#   scripts/preship.sh                    # every lane, stops at the first red
#   scripts/preship.sh oracles roster     # only the named lanes
#
# Lanes: oracles build roster lighthouse
set -euo pipefail

cd "$(dirname "$0")/.."
G="$HOME/.claude/guard/guarded"

lanes=("$@")
[ ${#lanes[@]} -eq 0 ] && lanes=(oracles build roster lighthouse)

# The browser lanes resolve chromium through an installed @playwright/test.
node -e 'require.resolve("@playwright/test")' 2>/dev/null || npm i --no-save @playwright/test lighthouse
export KF_PLAYWRIGHT_DIR="$PWD"

for lane in "${lanes[@]}"; do
    echo "── preship: $lane"
    case "$lane" in
        oracles)
            "$G" -- npx vitest run --project library \
                test/compile/entry-roundtrip.test.ts \
                test/compile/view-transition-roundtrip.test.ts \
                test/orchestration/split-a11y-oracle.test.ts \
                test/engine/en-fix-oracle.test.ts \
                test/scroll/trigger-oracle.test.ts ;;
        build)
            "$G" -- sh -c "npm run gh-pages && npm run proof:publish" ;;
        roster)
            KF_REQUIRE_BROWSER=1 KF_MWG_OPTIONAL=1 \
                "$G" --timeout 60 -- npm run demo:correctness -- --timeout=600 ;;
        lighthouse)
            KF_REQUIRE_BROWSER=1 "$G" -- npm run audit:lighthouse ;;
        *)
            echo "preship: unknown lane '$lane'" >&2
            exit 2 ;;
    esac
done
echo "── preship: all lanes green"
