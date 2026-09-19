SERVED MODEL: claude-opus-5[1m]

# ADDENDUM — KF-AT-21, beside `r-animation-sota.md` `:109` and `:253`

**Dated 2026-09-19 · X.KF.W10 `.d` (G-5, addendum 1 of 4) · E-3 ADDENDUM-NOT-PATCH.**
This file sits **beside** `docs/tranches/G/audit/r-animation-sota.md`. Not one byte of that
dated record is changed by this wave: `git diff -- docs/tranches/G/audit/r-animation-sota.md`
is **empty** at this close. The G-lane's own verdict text (G26-3's `:112` **BOOK** disposition)
is **not patched** and not re-graded here.

**Substrate of measurement.** keyframes.js `master` @ `27ec9c37` — the §B-12-settled sacred
checkout (`origin/master` `69095552` plus this wave's two landed unit commits) — read at the
**worktree bytes**, every figure double-run.

---

## 1. The anchors, re-resolved at the landing substrate before writing

| anchor | what occupies it at these bytes | role |
|---|---|---|
| **`:109`** | the `- **Where (verified):**` bullet of `### G26-3`, carrying both falsified halves | **THE ANCHOR** (the bank's own coordinate) |
| `:107` | the `### G26-3 — \`splitText\` (Intl.Segmenter) …` section heading | **containing-section label only — never the anchor** |
| **`:253`** | the ledger row *"F26-4 SplitText / demo grapheme \| BOOK + demo-fix \| **demo-fix DISCHARGED** (F.W16 word-split); engine primitive **STILL BOOK** → **G26-3**"* | **THE ANCHOR** (the row this addendum re-opens) |

The draft spelling `:107` is a **declared re-anchor, not a silent drift**: it is retained above
only so a reader can find the block, and is used as an anchor nowhere.

## 2. What `:109` asserts, and the two measurements that falsify it

`:109` asserts, in one bullet, (a) a zero-hit grep over `src/` and (b) that the demo's raw
UTF-16 per-char split is gone. **Both halves are false at these bytes.**

**(a) The zero-hit grep does not reproduce — the engine primitive SHIPPED.**

⟨cmd⟩ `grep -rniE "splitText|Intl\.Segmenter|grapheme" src/ | wc -l` → **73** (run 1) · **73** (run 2)
⟨cmd⟩ `grep -rliE "splitText|Intl\.Segmenter|grapheme" src/ | wc -l` → **6** (run 1) · **6** (run 2)
⟨cmd⟩ `ls -1 src/animation/orchestration/split-text/ | wc -l` → **4** (run 1) · **4** (run 2)

The four files are `index.ts` · `refuse.ts` · `segment.ts` · `split-text.ts`. `index.ts:11-19`
exports `splitText`, `SplitTextRefusalError`, `SplitTextRefusalReason` and `TextSegment`;
`segment.ts:31-64` resolves `Intl.Segmenter` once and segments at `granularity: "word"` and
`"grapheme"`, with a conservative regex fallback where the runtime lacks it. It landed at
**X.KF.W5 `.c`** — `2549c133` (*"splitText refuses before it mutates, never overrides an
implicit role, and reverts only what it wrote"*) and `c0727002`. The bullet's *"The engine's
text story is the `typewriter` preset … and the demo"* is therefore a **dated observation that
the tree has overtaken**, not a standing fact.

**(b) The raw UTF-16 per-char split is NOT gone.**

⟨cmd⟩ `grep -n 'split(' demo/components/instrument/shell/AnimatedText.vue`

```
106:        .split(/\s+/)
111:            return { text: w, chars: w.split(""), startIndex };
```

Both tiers ship: the phrase splits to **words** at `:106` and each word splits to **UTF-16 code
units** at `:111`. The word tier F.W16 added did not replace the per-char split; the per-char
split is what the hero's per-CHAR wave is built on. The component records the reason itself, at
`AnimatedText.vue:44-47`: *"The grapheme decision (KF-AT-3, `w.split("")`) is NOT spent here: it
is ATOMIC with KF.W4's oracle repair (KF-AT-4 — `usability.mjs` counts the same UTF-16 units),
and landing one half would green the gate on two wrong counters."*

## 3. The cure's fate — stated BY REFERENCE, re-derived nowhere

§3.4.1 permits either writing against the state at close or stating the cure's fate by
reference. Both halves are stated by reference to the waves that own them; this addendum spends
no cure and orders none.

- **KF-AT-4 (the oracle half) — LANDED.** `77d0e0b1`, the KF.W4 ∥ KF.W6 **atomic bundle** (one
  commit, both seats). `scripts/observe/demo/usability.mjs` now derives `DECLARED_HERO_TITLE`
  (`:89`) and `DECLARED_HERO_GLYPHS` (`:100`) statically from `EditorStartScreen.vue`'s title
  default, and clause (2c) at `:337` compares the rendered `charCount` against **that** — no
  longer against the subject's own counter. The record of that landing is
  `value.js docs/tranches/X/execution/B/KF-W4.md` Act 5.
- **KF-AT-3 (the grapheme half) — NOT SPENT.** `value.js docs/tranches/X/execution/B/KF-W6.md`
  §9 and its commit-A cell (`59ce4ca5`) state it in the wave's own words: *"KF-AT-3 NOT spent —
  atomic with KF.W4's KF-AT-4 oracle repair."* It is unspent at these bytes, which is why (b)
  above measures as it does.

## 4. The act: ledger row `:253` is RE-OPENED

The row is re-opened as a **dated row here**, never rewritten there. Its two cells are stale in
**both** directions at the close bytes, and the direction matters:

1. **"demo-fix DISCHARGED (F.W16 word-split)"** — the discharge's stated evidence (that the old
   raw-UTF-16 per-char split is gone) does not hold; §2(b). The word-split landed *beside* the
   per-char split, not *instead of* it.
2. **"engine primitive STILL BOOK"** — no longer true in the other direction: the primitive
   shipped at KF.W5 `.c`; §2(a).

**Terminal word: RE-OPENED (doc-truth), carried to the successor formation's ledger.** X.KF.W10
is a close wave: it spends no cure, re-grades no G-lane disposition and schedules no successor
act. A later seat evaluating G26-3 reads this addendum beside `:253` and re-measures both legs
rather than inheriting either.

## 5. What this addendum explicitly does NOT do

- It changes **no byte** of `r-animation-sota.md` (E-3; `git diff` empty at close).
- It does **not** patch or re-grade G26-3's `:112` disposition, nor the `:110`/`:111` SOTA and
  transposition cells.
- It does **not** spend KF-AT-3's grapheme cure, order one, or name a wave for it.
- It uses `:107` as a label only, never as an anchor.
