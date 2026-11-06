function big(value: bigint): bigint {
  if (typeof value !== 'bigint') throw new TypeError('Expected bigint');
  const limit = (1n << 4096n) - 1n;
  if (value > limit || value < -limit) throw new RangeError('4096-bit budget exceeded');
  return value;
}
export interface Gaussian {
  real: bigint;
  imaginary: bigint;
}
function check(z: Gaussian): void {
  if (z === null || typeof z !== 'object') throw new TypeError('Expected Gaussian');
  big(z.real);
  big(z.imaginary);
}
export function addGaussian(a: Gaussian, b: Gaussian): Gaussian {
  check(a);
  check(b);
  return { real: big(a.real + b.real), imaginary: big(a.imaginary + b.imaginary) };
}
export function multiplyGaussian(a: Gaussian, b: Gaussian): Gaussian {
  check(a);
  check(b);
  return {
    real: big(a.real * b.real - a.imaginary * b.imaginary),
    imaginary: big(a.real * b.imaginary + a.imaginary * b.real),
  };
}
export function normGaussian(a: Gaussian): bigint {
  check(a);
  return big(a.real * a.real + a.imaginary * a.imaginary);
}
function round(n: bigint, d: bigint): bigint {
  const sign = n < 0n ? -1n : 1n,
    x = n < 0n ? -n : n;
  return sign * ((x + d / 2n) / d);
}
export function divideGaussian(
  a: Gaussian,
  b: Gaussian,
): { quotient: Gaussian; remainder: Gaussian } {
  check(a);
  const d = normGaussian(b);
  if (d === 0n) throw new RangeError('Zero divisor');
  const q = {
      real: round(big(a.real * b.real + a.imaginary * b.imaginary), d),
      imaginary: round(big(a.imaginary * b.real - a.real * b.imaginary), d),
    },
    p = multiplyGaussian(q, b);
  return {
    quotient: q,
    remainder: { real: big(a.real - p.real), imaginary: big(a.imaginary - p.imaginary) },
  };
}
export function gcdGaussian(a: Gaussian, b: Gaussian): Gaussian {
  check(a);
  check(b);
  let x = { ...a },
    y = { ...b };
  for (let steps = 0; y.real !== 0n || y.imaginary !== 0n; steps++) {
    if (steps >= 8192) throw new RangeError('GCD budget');
    [x, y] = [y, divideGaussian(x, y).remainder];
  }
  for (let i = 0; i < 4; i++) {
    if ((x.real > 0n && x.imaginary >= 0n) || (x.real === 0n && x.imaginary === 0n)) return x;
    x = { real: -x.imaginary, imaginary: x.real };
  }
  throw new RangeError('Normalization failure');
}
