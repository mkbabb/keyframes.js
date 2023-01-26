# animation.js

Tiny TypeScript animation library. Kinda like gsap but worse :^D.

## Usage

### Create a new animation; [`animation.ts`](src/animation.ts)

```ts
const dutation = 5000;
const anim = new Animation(duration);
```

Where `duration` is the duration of the animation in milliseconds.

```ts
anim.from(0, {
    transform: {
        x: "0%",
        y: "0%",
    },
    color: "#C462D8",
})
    .transform(...)
    .ease(easeInBounce)
    ... // more keyframes here
    .done()
    .start();
```

### A keyframe, or `TemplateFrame`

Is composed of three things:

The `from` function initializes the keyframe to start at percentage `0` of the animation's duration. The second argument is an object containing the properties to be animated: not only can these be arbitrarily nested, but the atomic values therein can be:

-   numbers
-   strings coercible to numbers
-   essentially any CSS property value
-   any color parsable by [`d3-color`](https://github.com/d3/d3-color)

The `transform` function takes in two parameters: the first is the current animation's time, `t`, and the second are the variables defined in the keyframe, `vars`, though with all values interpolated to the current time. When used in a chain below a `from` call, the interpolated `vars` object will be strictly typed - handy for linting.

```ts
const transformFunc = (t: number, vars) => {
    const {color } = vars;
    ...
};
```

The `ease` function takes in a timing function to modify the previous keyframe by. This is a function that takes in a single parameter, `t`, and returns a number on the unit interval `[0, 1]`. Compatible with [`d3-ease`](https://github.com/d3/d3-ease)!

Both easing and transform functions are partially optional. If you don't specify a transform function, the closet keyframe with a previously defined transform function will be used - if that cannot be located, well no transformation will occur...

If you don't specify an easing function, the closest keyframe with a previously defined easing function will be used - if that cannot be located, a quadratic ease-in-out will be used.

### Starting the animation

The `done` function is used to finalize the animation. This parses all of the previously defined keyframes, stamping out `Frame` objects from each `TemplateFrame` created previous keyframes. This is a destructive process insofar as each call to `done` will clear the currently parsed keyframes, effectively resetting the animation.

The `start` function is used to start the animation. It returns a `Promise` that resolves when the animation is complete. You can await it or not, up to you.

### Demo

See [here](demo/script.ts) for a more complete demonstration of what can be done.

### Bonus features

#### Interpolate between two non-adjacent keyframes

```ts
anim.from(0, {
    color: "#C462D8",
    })
    ...
    // imagine many keyframes that  don't define color
    .from(100, {
        color: "#E85252",
    });
```

And `color` will be interpolated as if it were defined in every keyframe in between.

#### Reverse an animation

```ts
anim.reverse().done();
```

Note that is mutates the animation in place.

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
