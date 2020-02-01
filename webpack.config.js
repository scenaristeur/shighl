const path = require('path')

// Configurations shared between all builds
const common = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'shighl.bundle.js',
    library: 'Shighl',
    libraryExport: 'default',
  },
  externals: {
    'solid-auth-cli': 'null',
    //  '@solid/query-ldflex': 'query-ldflex',
    /*  '@solid/query-ldflex': {
    commonjs: 'query-ldflex',
    commonjs2: 'query-ldflex',
    amd: 'query-ldflex',
    root: 'data'
  },*/
  'rdflib': {
    commonjs: 'rdflib',
    commonjs2: 'rdflib',
    amd: 'rdflib',
    root: '$rdf'
  },
},
devtool: 'source-map',
/*optimization: {
  splitChunks: {
    chunks: 'all',
  },
},*/
}

// Configurations specific to the window build
const window = {
  ...common,
  name: 'window',
  output: {
    ...common.output,
    path: path.resolve(__dirname, 'dist', 'window'),
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true
  },
  devtool: "eval-source-map",
  performance: { hints: false }
}

// Configurations specific to the node build
const node = {
  ...common,
  name: 'node',
  output: {
    ...common.output,
    path: path.resolve(__dirname, 'dist', 'node'),
    libraryTarget: 'commonjs2',
  },
}

module.exports = [
  window,
  node,
]
