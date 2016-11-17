module.exports = {
  entry: './jsx/content.jsx', // エントリポイントのjsxファイル
  output: {
    filename: './js/content.js' // 出力するファイル
  },
  module: {
    loaders: [{
      test: /\.jsx?$/, // 拡張子がjsxで
      exclude: /node_modules/, // node_modulesフォルダ配下でなければ
      loader: 'babel', // babel-loaderを使って変換する
      query: {
        plugins: ["transform-react-jsx"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
      }
    }]
  }
}