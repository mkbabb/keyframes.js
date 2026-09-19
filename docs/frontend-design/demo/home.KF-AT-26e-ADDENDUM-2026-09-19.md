SERVED MODEL: claude-opus-5[1m]

# ADDENDUM — KF-AT-26(e), beside `home.md` `:67`, `:187-191` and `:367`

**Dated 2026-09-19 · X.KF.W10 `.d` (G-5, addendum 4 of 4) · E-3 ADDENDUM-NOT-PATCH.**
This file sits **beside** `docs/frontend-design/demo/home.md`. Not one byte of that dated
design record is changed: `git diff -- docs/frontend-design/demo/home.md` is **empty** at this
close. The refinement's **intent** — keep the CSS lift as the reduced-motion / no-engine
fallback and layer an engine-driven lift on top — is **not re-graded** here.

**Substrate of measurement.** keyframes.js `master` @ `27ec9c37` (the §B-12-settled sacred
checkout; `origin/master` `69095552` plus this wave's two landed unit commits), read at the
**worktree bytes**, every figure double-run.

---

## 1. The anchors, re-resolved at the landing substrate before writing

| anchor | what it asserts at these bytes |
|---|---|
| **`:67`** | *"`AnimatedText.vue:78–91`: `@keyframes liftDown` lifts each word `-10px` for ~5% of a 3s cycle, then rests for 90%."* |
| **`:187-191`** | *"**KEEP the idle `liftDown`; PROMOTE it** … Today `AnimatedText`'s `liftDown` (AnimatedText.vue:78–91) is a hand-rolled CSS `@keyframes` … `liftDown` remains the reduced-motion / no-engine fallback"* |
| **`:367`** | *"**REVERSED — "Replace the idle `liftDown`" → "KEEP `liftDown`, promote it."**"* |

All three resolve, each carrying exactly the text quoted.

## 2. The doc-truth fact: `liftDown` is a name this repository does not carry

**Counting rule, stated at the enumeration** (the mixed rule is what hides drift): *lines* are
`grep -c` rows, *occurrences* are `grep -o` tokens; one line may carry two tokens.

⟨cmd⟩ `grep -c 'liftDown' docs/frontend-design/demo/home.md` → **8 lines** (run 1) · **8** (run 2)
⟨cmd⟩ `grep -o 'liftDown' docs/frontend-design/demo/home.md | wc -l` → **9 occurrences** (run 1) · **9** (run 2)
⟨cmd⟩ `grep -rn 'liftDown' demo/ src/ test/ scripts/ | wc -l` → **0** (run 1) · **0** (run 2)

**8 doc hits, 0 in code.** The eight lines are `:67` · `:187` · `:188` · `:191` · `:367` ·
`:368` · `:414` · `:416`; the ninth occurrence is `:367`, which names it twice. **Five fall
inside the three anchored spans** (`:67`, `:187`/`:188`/`:191`, `:367`); **three fall outside
them** — `:368` (the continuation of `:367`'s bullet), `:414` and `:416` (the implementation-plan
step) — recorded here so the count is honest, not corrected as separate claims.

## 3. What the tree actually ships

⟨cmd⟩ `grep -n '@keyframes\|animation:' demo/components/instrument/shell/AnimatedText.vue`

```
165:    animation: charLift var(--wave-cycle) infinite both;
169:@keyframes charLift {
196:        animation: none;
```

The shipped mechanism is **`charLift`** — declared at `AnimatedText.vue:169`, applied at `:165`
on `.wave-char` with `animation-delay: calc(var(--wave-i, 0) * var(--wave-step))` (`:166`). It
is a **per-CHAR** lift over the KF-AT-16 registers (`--wave-cycle` · `--wave-step` ·
`--wave-lift`), and reduced motion is honoured by the producer's per-component idiom —
`--motion-weight: 0` on the host (`:193`) plus `animation: none` on `.wave-char` (`:195-196`).

**The cited coordinate is dead in name and in position.** All three anchored sites cite
`AnimatedText.vue:78–91`; at these bytes ⟨cmd⟩ `sed -n '78,91p'` over that file returns the
KF-AT-2 fallthrough docblock and the head of `defineProps` inside `<script setup>` — **no
`@keyframes` block, no `<style>` block, no `liftDown`**.

## 4. The consequence for the document's three claims, stated without patching them

- **`:67`** describes a **word-tier** lift of `-10px` on a 3s cycle. The shipped lift is
  **per-CHAR**, its amplitude lives in `--wave-lift` (a `calc()` over `--motion-weight`) and its
  cycle in `--wave-cycle` — so the figure, the tier and the name are each stale. What the bullet
  is *about* — an idle decorative lift whose engine provenance is invisible to a visitor — is not
  contradicted by this measurement and is not re-graded here.
- **`:187-191`** and **`:367`** order the keeping and promotion of an instrument **by a name
  nothing in the tree carries**. A later seat executing the MOTION clause reads this addendum
  first and resolves the name at the tree (`charLift`) rather than inheriting `liftDown`.
- **No rename is ordered by this record.** Naming is the owning wave's act; X.KF.W10 is a close
  wave and spends no cure.

## 5. What this addendum explicitly does NOT do

- It changes **no byte** of `home.md` (E-3; `git diff` empty at close).
- It does not re-grade the refinement, its verdict §2/§3/§4 reversals, or the implementation plan.
- It orders no rename, no cure and no successor act.
