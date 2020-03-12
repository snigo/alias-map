import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default {
  input: 'src/alias-map.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    compiler(),
  ],
};
