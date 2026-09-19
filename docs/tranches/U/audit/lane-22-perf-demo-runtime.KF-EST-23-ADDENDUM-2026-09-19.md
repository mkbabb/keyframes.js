SERVED MODEL: claude-opus-5[1m]

# ADDENDUM — KF-EST-23, beside `lane-22-perf-demo-runtime.md` `:110-112` and `U.D.md` `:194`

**Dated 2026-09-19 · X.KF.W10 `.d` (G-5, addendum 2 of 4) · E-3 ADDENDUM-NOT-PATCH.**
This file sits **beside** `docs/tranches/U/audit/lane-22-perf-demo-runtime.md`, the first-named
of its two originals, and addresses **both** by full path and anchor (§2). Neither original is
touched: `git diff -- docs/tranches/U/audit/lane-22-perf-demo-runtime.md docs/tranches/U/waves/U.D.md`
is **empty** at this close. The set of doc-truth addenda is **four** and this is one of them —
one addendum, one class, two documents (KF-EST-23's own framing: *"same class, second and third
documents"*). Its physical home beside the first anchor is **declared here, not drifted into**.

**Substrate of measurement.** keyframes.js `master` @ `27ec9c37` (the §B-12-settled sacred
checkout; `origin/master` `69095552` plus this wave's two landed unit commits), read at the
**worktree bytes**.

**Anchor spelling lock.** The anchors are **`:110-112`** and **`:194`**, once and identically.
The `:106-115` / `:108-114` / `:193-195` variants are struck and appear nowhere in this file.

---

## 1. The anchors, re-resolved at the landing substrate before writing

| anchor | text carried at these bytes |
|---|---|
| `lane-22-perf-demo-runtime.md` **`:110-112`** | *"…the LCP element — the hero `<h1>` in `instrument/shell/EditorStartScreen.vue` — imports only `@lucide/vue` `List`, `AnimatedText`, `TypingDots` (`EditorStartScreen.vue:61-63`): **zero engine dependency.**"* |
| `U.D.md` **`:194`** | *"…(`EditorStartScreen.vue:61-63`) has ZERO engine dependency, yet mount waits on the full heavy graph."* |

Both resolve, each carrying exactly the text quoted.

## 2. EXACTLY TWO CLAIMS ARE CORRECTED — one per document, and they are the same claim

**Claim 1 — `lane-22-perf-demo-runtime.md:110-112`: "zero engine dependency".**
**Claim 2 — `U.D.md:194`: "has ZERO engine dependency".**

**Correction (both):** the *import list* is true; the *conclusion* is **false transitively**. A
hero that imports no engine module still **contains** a component that awaits one.

⟨cmd⟩ `grep -n '^import' demo/components/instrument/shell/EditorStartScreen.vue`

```
136:import { List } from "@lucide/vue";
137:import AnimatedText from "./AnimatedText.vue";
138:import TypingDots from "./TypingDots.vue";
```

Three imports, exactly the three named. ⟨cmd⟩ `sed -n '65,68p' …/EditorStartScreen.vue`:

```
65:        <h1 class="hero-display text-display-mega">
66:            <AnimatedText text="Select an animation" />
67:            <span class="hero-dots"><TypingDots /></span>
68:        </h1>
```

`<TypingDots />` is **inside the LCP `<h1>`** at `:67`. ⟨cmd⟩ `grep -n 'onMounted\|loadAnimationEngine'
demo/components/instrument/shell/TypingDots.vue`:

```
133:onMounted(async () => {
137:    const { CSSKeyframesAnimation } = await loadAnimationEngine();
```

So the LCP element's own subtree reaches `loadAnimationEngine()` at mount. The corrected
statement, for both documents: **the hero's GLYPH tier is engine-free; the hero ELEMENT is not —
its dots tier awaits the heavy graph from inside the `<h1>`.**

## 3. CORRECTION BOUNDARY — what survives, what stays retired, what is not re-opened

Stated so the addendum cannot over-correct. **Exactly the two claims above are corrected, and
neither of the following is reinstated.**

- **F3's transposition verdict SURVIVES, on corrected premises.** `lane-22:103`'s finding
  (*"LCP hero is gated on the entire heavy engine graph it never uses"*), its proposal at
  `:122-129`, and `U.D.md:192-198`'s architectural transposition are **untouched and not
  re-graded**. The corrected premises are the ones the adjudication names: the **glyphs paint
  engine-free at frame 0**, and the **dots' late start is designed**, not a regression. A mount
  gate that waits on the heavy graph is still a mount gate that waits on the heavy graph.
- **The `main.ts` elision charge is RETIRED and is NOT reinstated here.** The corpus's own
  ellipsis marked it (reader-LC's kill, byte-verified in the adjudication). This addendum makes
  no claim about what `main.ts`'s quotation elided.
- **Recorded, not corrected — the same claim's evidence line.** The `EditorStartScreen.vue:61-63`
  coordinate recurs at `lane-22:121` as claim 1's own Evidence bullet. It is the same claim's
  evidence, **not a third claim**, and takes no separate correction. For the record: the three
  imports now sit at `:136-138` (§2) and `:61-63` is prose inside the file's docblock at these
  bytes — a coordinate drift in a dated record, recorded here, unpatched there.
- **Not re-opened here:** the lane's `@utils/kfEngine.ts` specifier. It is a separate adjudicated
  finding of the KF-EST-23 registry row and lies **outside this addendum's two-claim boundary**;
  no measurement of it is made or asserted in this file.

## 4. What this addendum explicitly does NOT do

- It changes **no byte** of either original (E-3; `git diff` empty on both at close).
- It corrects **two** claims — no third, in either document.
- It does not re-grade F3, F2, or any other lane finding, and orders no cure: X.KF.W10 is a
  close wave and spends none.
