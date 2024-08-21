// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/index.ts',
	output: [
    {
      file: 'dist/index.js',
      format: 'esm'
    },
    // {
    //   file: 'dist/index.js',
    //   format: 'umd'
    // }
  ],
  plugins: [typescript({declarationDir: 'dist'}), nodeResolve()]
};