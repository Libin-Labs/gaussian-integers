import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('exact product and norm', () => {
  assert.deepEqual(
    api.multiplyGaussian({ real: 2n, imaginary: 3n }, { real: 4n, imaginary: -1n }),
    { real: 11n, imaginary: 10n },
  );
  assert.equal(api.normGaussian({ real: 3n, imaginary: 4n }), 25n);
});
test('half ties', () => {
  assert.deepEqual(
    api.divideGaussian({ real: -1n, imaginary: 1n }, { real: 2n, imaginary: 0n }).quotient,
    { real: -1n, imaginary: 1n },
  );
});
test('normalized gcd', () => {
  assert.deepEqual(api.gcdGaussian({ real: 5n, imaginary: 0n }, { real: 2n, imaginary: 1n }), {
    real: 2n,
    imaginary: 1n,
  });
});
test('zero behavior', () => {
  assert.deepEqual(api.gcdGaussian({ real: 0n, imaginary: 0n }, { real: 0n, imaginary: 0n }), {
    real: 0n,
    imaginary: 0n,
  });
  assert.throws(() => api.divideGaussian({ real: 1n, imaginary: 0n }, { real: 0n, imaginary: 0n }));
});
test('type and intermediate budget', () => {
  assert.throws(() => api.normGaussian({ real: 1, imaginary: 0n }));
  assert.throws(() => api.normGaussian({ real: 1n << 3000n, imaginary: 0n }));
});
test('Euclidean certificate oracle', () => {
  for (let r = -6; r <= 6; r++)
    for (let i = -6; i <= 6; i++) {
      const a = { real: BigInt(r), imaginary: BigInt(i) },
        b = { real: 3n, imaginary: 2n };
      const { quotient: q, remainder: t } = api.divideGaussian(a, b);
      assert.equal(q.real * b.real - q.imaginary * b.imaginary + t.real, a.real);
      assert.equal(q.real * b.imaginary + q.imaginary * b.real + t.imaginary, a.imaginary);
      assert.ok(t.real * t.real + t.imaginary * t.imaginary < 13n);
    }
});
