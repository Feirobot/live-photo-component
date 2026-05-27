import terser from '@rollup/plugin-terser';

export default [
  // ES Module
  {
    input: 'src/live-photo.js',
    output: {
      file: 'dist/live-photo.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser()]
  },
  // UMD (Browser CDN)
  {
    input: 'src/live-photo.js',
    output: {
      file: 'dist/live-photo.umd.js',
      format: 'umd',
      name: 'LivePhoto',
      sourcemap: true
    },
    plugins: [terser()]
  }
];
