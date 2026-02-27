# Frontend Codebase Hardening Audit

Run a comprehensive codebase hardening audit on this project. Investigate each category below, identify issues, and fix them. This is a systematic process — not every category will have issues, but all must be checked.

## Phase 1: TypeScript Strictness

Check `tsconfig.json` for missing strict options. If any are absent, add them:
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `isolatedModules: true`
- `useDefineForClassFields: true`
- `forceConsistentCasingInFileNames: true`

Then run `npx tsc --noEmit` and fix resulting errors (typically array index assertions via `!`, and `| undefined` additions for optional property types).

## Phase 2: Module-Scope Side Effects (Vue/React)

Search for composables, hooks, or reactive primitives called at **module scope** (outside component setup/render). These silently fail in Safari and strict environments.

**Pattern to find:**
```
grep -rn "useStorage\|useLocalStorage\|useState\|useRef\|ref(" --include="*.ts" --include="*.tsx" --include="*.vue"
```

Look for calls that are NOT inside: `setup()`, `onMounted()`, `useEffect()`, a component function body, or a lazy-init getter.

**Fix pattern:** Wrap in lazy-init getter:
```ts
let _store: ReturnType<typeof useStorage<T>> | null = null;
const getStore = (): ReturnType<typeof useStorage<T>> => {
    if (!_store) {
        try {
            _store = useStorage("key", defaultValue);
        } catch {
            _store = ref(defaultValue) as any; // Safari private browsing fallback
        }
    }
    return _store!;
};
```

## Phase 3: Event Listener & Memory Leaks

### 3a. Duplicate Event Registration
Search for components that register events BOTH in template (`@click`, `@mousedown`, etc.) AND in `onMounted`/`useEventListener`. Remove the template directives, keep the programmatic ones (they handle `{ passive: false }` and window-level tracking).

### 3b. Raw `window.addEventListener` Without Cleanup
Search for `window.addEventListener` or `document.addEventListener` that lack corresponding `removeEventListener` in unmount. Replace with framework-managed listeners (`useEventListener` in Vue, cleanup in `useEffect` return for React).

### 3c. Editor/Heavy Component Disposal
Search for Monaco, CodeMirror, Chart.js, Three.js, or similar heavy library instances. Verify they call `.dispose()` or equivalent in `onUnmounted`/cleanup.

### 3d. setTimeout/setInterval Without Cleanup
Search for `setTimeout` and `setInterval` calls. Verify the returned ID is stored and cleared in unmount.

## Phase 4: Animation/Async Robustness

### 4a. Multiple play()/start() Guard
If the project has animation or async task classes, verify that calling `play()` twice doesn't create duplicate loops. Add early-return guard with stored promise.

### 4b. Toggle Race Conditions
Search for `this.X = !this.X` toggle patterns in pause/resume/toggle methods. Replace with explicit `pause()` sets true, `resume()` sets false.

### 4c. Floating Promises in forEach
Search for `.forEach(async` — this creates unhandled floating promises. Replace with `await Promise.all([...].map(async ...))`.

### 4d. Input Validation at Boundaries
For public API methods that accept duration, count, or numeric config: add guards for `NaN`, `Infinity`, negative values, zero (division by zero).

### 4e. Missing Public Exports
Check if any fully-implemented classes/functions are imported but not re-exported from the package entry point.

## Phase 5: Security

### 5a. innerHTML with User Content
Search for `.innerHTML =` on `<style>`, `<script>`, or content elements where the value comes from user input, URL params, or editable fields. Replace with `.textContent =` for style elements. For content elements, use framework rendering or sanitization.

### 5b. Unvalidated Deserialization
Search for `JSON.parse` on data from URL hash, query params, postMessage, or localStorage. Add shape validation before applying to reactive state:
```ts
const isValidState = (s: unknown): s is ExpectedShape => {
    if (typeof s !== "object" || s === null) return false;
    // validate expected keys and types
    return true;
};
```

## Verification Checklist

After all fixes:
1. `npx tsc --noEmit` — zero errors
2. `npm test` — all tests pass
3. `npm run build` — succeeds
4. Dev server — page loads, core interactions work, zero console errors
5. Manual check: dark mode toggle, navigation, form inputs, animations
