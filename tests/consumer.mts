import { normGaussian, multiplyGaussian } from '@lp-labs/gaussian-integers';
if (
  normGaussian(multiplyGaussian({ real: 1n, imaginary: 1n }, { real: 1n, imaginary: -1n })) !== 4n
)
  throw new Error('Gaussian');
// @ts-expect-error invalid argument must be rejected by declarations
normGaussian({ real: 1, imaginary: 0n });
