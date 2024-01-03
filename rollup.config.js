const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { terser, } = require('rollup-plugin-terser')

const input = './src/index.js'

const name = 'GraphQLNormalizr'
const globals = { graphql: 'GraphQL', }
const babelOpts = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
}

module.exports = [
  {
    input,
    output: {
      file: 'dist/graphql-normalizr.umd.js',
      format: 'umd',
      name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOpts),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development'), }),
    ],
  },

  {
    input,
    output: {
      file: 'dist/graphql-normalizr.min.js',
      format: 'umd',
      name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOpts),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production'), }),
      terser(),
    ],
  },
  require('./rollup.config.cjs'),
  require('./rollup.config.esm'),
]
