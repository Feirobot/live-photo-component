import { copyFileSync, mkdirSync } from 'node:fs';
import terser from '@rollup/plugin-terser';

// Copy static assets (styles + LIVE icon) into dist/ on every build,
// so the published package always contains dist/styles.css and dist/live-icon.png.
function copyAssets() {
  return {
    name: 'copy-assets',
    buildStart() {
      mkdirSync('dist', { recursive: true });
    },
    closeBundle() {
      copyFileSync('src/styles.css', 'dist/styles.css');
      copyFileSync('src/live-icon.png', 'dist/live-icon.png');
    }
  };
}

export default [
  // ES Module
  {
    input: 'src/live-photo.js',
    output: {
      file: 'dist/live-photo.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser(), copyAssets()]
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
    plugins: [terser(), copyAssets()]
  }
];
