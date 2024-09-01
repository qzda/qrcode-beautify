// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';

export default {
	input: 'src/index.ts',
	output: [
    {
      file: 'dist/index.js',
      format: 'esm'
    },
    // {
    //   name: 'qrcodeKit',
    //   file: 'dist/index.js',
    //   format: 'umd',
    // }
  ],
  plugins: [
    commonjs(),
    typescript({declarationDir: 'dist'}), 
    /** 
     * 可以将npm包源码一并打包
     */
    // nodeResolve(), 
    // peerDepsExternal(),
  ],
};