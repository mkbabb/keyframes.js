# animation.js

Simple TypeScript animation library.

## About

The bulk of this library's functionality comes from two functions `smoothAnimate` and `animationLoopOuter`:

### `smoothAnimate`

Takes a starting number, ending number, total duration (in `ms`), and two functions:

-   `transformFunc`: applied at every "frame" of execution; take two parameters, the current time, and the current time normalized between [0, 1].
-   `timingFunc`: (similar to CSS's `timing-function`) dictates how the number `to` reaches `from` in `duration` time.

Both of the above functions can return an optional boolean value, which will force the animation to halt.

For example, if you wanted to animate a `div`'s opacity attribute, going from `100%` to `0%`, using an `ease-in-out` (provided by the library) timing function, you could:

```ts
const transformFunc = (v, t): any => {
    d.style.opacity = v;
};

smoothAnimate(0, 100, 1000, transformFunc, easeInOutCubic);
```

Easy. Most everything else builds off of this idea.

### `animationLoopOuter`

Which is a basic animation loop: give it a
function to update on every frame, or draw, and function to execute on every update. Like both functions within `smoothAnimate`, they can return an optional boolean value, forcing the loop to halt.

## Math

Frankly, the more interesting part of the library is the collection of various timing functions housed within the `math.ts` file.

### Bezier Curves

For instance, `DeCasteljau` is a dynamic programming implementation thereof, allowing for (semi) fast n-th degree Bezier curve calculations. This is used by every `bezier*` function herein.

To create your own n-th degree Bezier timing function, you can use the aforesaid; to create the more common cubic Bezier curve, the appellative `cubicBezier` is provided: it's essentially identical in function to the similar CSS variant thereof:

```ts
const [x, y] = cubicBezier(t / duration, 0.09, 0.91, 0.5, 1.5);
```

> _`cubicBezier` returns both the x and y coordinates: typically one's only interested in the y._

I strongly recommend you use [this](https://cubic-bezier.com/) great website to play around within different curves visually.

Finally, as another interactive Bezier demo, you can check out [this](https://www.desmos.com/calculator/tvivnkflzv) Desmos graph I've made. Pretty neat!

### Easing

Additionally, a portion of [Robert Penner's](http://robertpenner.com/easing/) set of easing functions are implemented here.
