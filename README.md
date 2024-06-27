# keyframes.js

Create keyframe animations for **anything** in JavaScript; specify your keyframes in standards-complaint CSS.

## Quick Start using `CSS`

Add a function to be called on each frame:

```ts
const transformCSSKeyframes = (t: number, vars) => {
    const { transform, backgroundColor } = vars;

    box.style.transform = transform.toString();
    box.style.backgroundColor = backgroundColor.toString();
};
```

Add keyframes to the animation:

```css
@keyframes mijn-keyframes {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(0turn);
        background-color: #C462D8;
    }
    100% {
        transform: translateX(50%) translateY(75%) rotate(1turn);
        background-color: #E85252;
    }
}
`;
```

```ts
const CSSKeyframes = ...
anim.fromCSSKeyframes(CSSKeyframes, transformCSSKeyframes);
```

## `Animation` and `CSSKeyFramesAnimation`

## Groups of `Animation`

## Math

The more interesting part of the library is the collection of various timing functions housed within
[`easing.ts`](src/easing.ts), with utility math functions being defined in [`math.ts`](src/math.ts).

### Bezier Curves

For instance, `deCasteljau` is a dynamic programming implementation thereof, allowing for (semi) fast n-th degree Bezier curve calculations. This is used by every `bezier*` function herein.

To create your own n-th degree Bezier timing function, you can use the aforesaid; to create the more common cubic Bezier curve, the appellative `cubicBezier` is provided: it's essentially identical in function to the similar CSS variant thereof:

```ts
const [x, y] = cubicBezier(t / duration, 0.09, 0.91, 0.5, 1.5);
```

> _`cubicBezier` returns both the x and y coordinates: typically one's only interested in the y._

I strongly recommend you use [this](https://cubic-bezier.com/) great website to play around within different curves visually.

Finally, as another interactive Bezier demo, you can check out [this](https://www.desmos.com/calculator/tvivnkflzv) Desmos graph I've made. Pretty neat!

### [`easing.ts`](src/easing.ts)

Additionally, a portion of [Robert Penner's](http://robertpenner.com/easing/) set of easing functions are implemented, though using a modified scheme which assumes the input `t` value is on the unit interval `[0, 1]`
