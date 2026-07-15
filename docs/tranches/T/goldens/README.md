# T.M3 — the owner-golden reference frames (PENDING-OWNER)

The owner-anchored perceptual reference oracle (`proof:owner-golden`, T.M3, lane 29
rec 2) replaces `proof:visual-lock`'s **self-captured baseline + full-subject mask**
with an **owner-blessed reference render** kept in this directory. This is the
appearance authority the S roster never had: a green here means "the render matches
what the OWNER approved," not "the render has not drifted from whatever the tree
happened to paint" (visual-lock's self-baseline) and not "a bbox exists" (the
existence proxies).

## The matrix

7 owner-cited scenes × 2 themes = **14 goldens**, captured under the PRM-frozen
protocol visual-lock uses (`prefers-reduced-motion: reduce` + `colorScheme`, 1440×900):

```
home · cube · amiga · square · easing · spring · sequence   ×   light · dark
```

Every capture pins the controls pane to the canonical **PANE=LIT** state: the
capture harness emits a fresh pointer move immediately before each screenshot,
so the 10-second idle fade cannot contaminate the owner reference.

The subjects of verdict items #1/#4/#9/#21 (the CSS-3D cube, the amiga sphere, the
engine balls, the typing dots) stay **IN** the comparison — the mask visual-lock
painted flat pink is FORBIDDEN. A quality-shaped **subject edge-energy floor**
asserts each golden is a WHOLE render, so a masked/blank/one-face frame can never be
blessed.

## Layout

```
docs/tranches/T/goldens/
├── README.md            — this protocol
├── BLESSED.json         — THE OWNER TOKEN (absent today ⇒ the gate is born-RED)
├── candidates/          — PENDING-OWNER capture (<scene>-<theme>.png), NEVER self-blessed
└── golden/              — the BLESSED frames (<scene>-<theme>.png), copied from a blessed candidate
```

## The born-OWNER contract

`proof:owner-golden` GREEN is **UNREACHABLE** without a committed owner blessing.
It reds today by design: `BLESSED.json` is absent. The flow:

1. **Capture the candidates** (from the LANDED tree, after `npm run gh-pages`):
   ```sh
   KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui \
     node scripts/proof-owner-golden.mjs --capture-candidates
   ```
   → writes 14 frames to `candidates/` as **PENDING-OWNER**.

2. **The owner reviews** the candidate frames at the mid-drive/close review (served
   via the landed tree — see `docs/tranches/T/REVIEW-PACKET.md`).

3. **The owner blesses** by committing `BLESSED.json` (schema below) — naming each
   approved candidate's `sha256` — and copying each blessed candidate into `golden/`.
   Only then can the gate reach green (blessing token + subject-full floor + the live
   dHash render match).

4. **Lockstep** (T.M3): on the blessing, `proof:visual-lock` is retired or demoted to
   a pure no-drift corroborator (the demote-vs-retire call executes WITH the blessing);
   its subject-mask list is removed in the same motion.

## `BLESSED.json` schema (the owner token — a band name or a green-gate citation is NOT a token)

```jsonc
{
  "blessedBy": "<owner>",                     // e.g. "mkbabb"
  "blessedAt": "<ISO-8601 date>",             // when the review happened
  "blessedCommit": "<SHA the candidates were captured from>",
  "entries": {
    "home-light":  { "verdict": "OWNER-APPROVED", "candidate": "<sha256 of golden/home-light.png>" },
    "home-dark":   { "verdict": "OWNER-APPROVED", "candidate": "<sha256 of golden/home-dark.png>" },
    "cube-light":  { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "cube-dark":   { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "amiga-light": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "amiga-dark":  { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "square-light":{ "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "square-dark": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "easing-light":{ "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "easing-dark": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "spring-light":{ "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "spring-dark": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "sequence-light": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" },
    "sequence-dark": { "verdict": "OWNER-APPROVED", "candidate": "<sha256>" }
  }
}
```

A rejected candidate is NOT blessed — the owner re-directs the owning scene wave
(the disjunctive-spec trap is forbidden: a "fix-or-remove" oracle may not self-certify
the remove branch without the owner token that removal is the intended disposition).
