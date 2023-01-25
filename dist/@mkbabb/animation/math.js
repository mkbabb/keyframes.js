function s(n, e, u) {
  return n < e ? e : n > u ? u : n;
}
function o(n, e) {
  const u = e.length - 1;
  let r = [...e];
  for (let c = 1; c <= u; c++)
    for (let t = 0; t <= u - c; t++)
      r[t] = a(n, r[t], r[t + 1]);
  return r[0];
}
function i(n, e, u, r, c) {
  return [o(n, [0, e, r, 1]), o(n, [0, u, c, 1])];
}
function l(n, e, u, r) {
  return n = i(n / r, 0.09, 0.91, 0.5, 1.5)[1], u * n + e;
}
function p(n, e, u, r) {
  return n = i(n / r, 0.19, -0.53, 0.83, 0.67)[1], u * n + e;
}
function I(n, e, u, r) {
  return u * (n /= r) * n + e;
}
function b(n, e, u, r) {
  return -u * (n /= r) * (n - 2) + e;
}
function h(n, e, u, r) {
  return (n /= r / 2) < 1 ? u / 2 * n * n + e : -u / 2 * (--n * (n - 2) - 1) + e;
}
function C(n, e, u, r) {
  return u * (n /= r) * n * n + e;
}
function O(n, e, u, r) {
  return u * ((n = n / r - 1) * n * n + 1) + e;
}
function B(n, e, u, r) {
  return (n /= r / 2) < 1 ? u / 2 * n * n * n + e : u / 2 * ((n -= 2) * n * n + 2) + e;
}
function Q(n, e, u, r) {
  return n /= r, u * Math.pow(n, 2) * (3 - 2 * n) + e;
}
function d(n, e, u, r) {
  return u * (n /= r) + e;
}
function a(n, e, u) {
  return (1 - n) * e + n * u;
}
function g(n, e, u) {
  return e = e === 0 ? 1e-9 : e, e * Math.pow(u / e, n);
}
function f(n, e) {
  const u = e.map((c) => c[0]), r = e.map((c) => c[1]);
  return [o(n, u), o(n, r)];
}
function j(n, e, u, r) {
  const c = [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ];
  return n = f(n / r, c)[1], u * n + e;
}
export {
  p as bounceInEase,
  j as bounceInEaseHalf,
  s as clamp,
  i as cubicBezier,
  o as deCasteljau,
  l as easeInBounce,
  C as easeInCubic,
  B as easeInOutCubic,
  h as easeInOutQuad,
  I as easeInQuad,
  O as easeOutCubic,
  b as easeOutQuad,
  f as interpBezier,
  a as lerp,
  d as lerpIn,
  g as logerp,
  Q as smoothStep3
};
//# sourceMappingURL=math.js.map
