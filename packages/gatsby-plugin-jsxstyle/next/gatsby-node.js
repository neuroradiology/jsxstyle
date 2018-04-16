const JsxstyleLoaderPlugin = require('jsxstyle-loader/plugin');

exports.modifyWebpackConfig = ({ config } /*, options*/) => {
  config.plugin('jsxstyle-loader', () => new JsxstyleLoaderPlugin());
  config.preLoader('jsxstyle-loader', {
    test: /\.jsx?$/,
    loader: require.resolve('jsxstyle-loader'),
  });
};
