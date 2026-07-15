# Makefile — L.W4 S3 (W29): the Linux-container local-repro for CI flakes.
#
# THE BREACH the K close named: a Linux-specific CI flake's ONLY feedback channel
# was push → wait ~30 min → read CI. No Makefile / Dockerfile / act harness existed,
# so a macOS-pass / Linux-fail race (the 259-fixed-ms-sleep class) could only be
# reproduced on the slow GitHub Linux runner — one round-trip per iteration.
#
# THE CURE: `make ci-linux` pulls the SAME base image GHA's ubuntu-latest uses for
# the Node toolchain (node:24-slim — kf runs Node 24 in CI), mounts the repo at
# /workspace read-write, and runs the demo-smoke roster inside the container, exiting
# with the container's exit code. A Linux-only flake now reproduces locally in one
# `make ci-linux`, no push required.
#
# docker is the ONLY new dependency (already present on developer machines that run
# Playwright). No new npm dependency. The Makefile clause asserts this
# `ci-linux:` target exists (file-existence, not a Docker execution — the gate stays
# headless; CI never runs Docker-in-Docker).

# The base image: node:24-slim matches kf's CI Node 24 (the newest runtime the
# published library faces; ci.yml setup-node node-version: 24).
CI_IMAGE ?= node:24-slim

# The demo roster the container runs: install → build the demo → the retained
# correctness runner. Browser observations need chromium +
# its system libraries; the slim image lacks them, so the container installs the
# Playwright browser + deps first (the same `npx playwright install --with-deps
# chromium` step ci.yml's demo-smoke job runs). KF_REQUIRE_BROWSER=1 makes a
# playwright-absent skip a hard fail — the parity with CI is the whole point.
CI_LINUX_CMD ?= set -e; \
	npm ci; \
	npm i --no-save @playwright/test lighthouse; \
	npx playwright install --with-deps chromium; \
	npm run gh-pages; \
	KF_REQUIRE_BROWSER=1 npm run demo:correctness

.PHONY: ci-linux
ci-linux:
	docker run --rm \
		-v "$(CURDIR)":/workspace \
		-w /workspace \
		-e KF_REQUIRE_BROWSER=1 \
		$(CI_IMAGE) \
		bash -lc '$(CI_LINUX_CMD)'
