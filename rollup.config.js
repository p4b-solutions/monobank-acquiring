const typescript = require('@rollup/plugin-typescript')

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'auto'
    }
  ],
  external: [],
  plugins: [typescript({ tsconfig: './tsconfig.json', sourceMap: false, declaration: true, outDir: 'dist', exclude: ['**/*.test.ts'] })]
}
