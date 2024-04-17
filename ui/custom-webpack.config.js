const webpack = require("webpack");
const pkg = require("./package.json");

module.exports = (config, options, targetOptions) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    })
  );

  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    querystring: require.resolve("querystring-es3"),
    vm: require.resolve("vm-browserify"),
  });
  config.resolve.fallback = fallback;

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })

    // new webpack.ProvidePlugin({
    //   Buffer: ['buffer', 'Buffer'],
    // }),
  ];
  return config;
};

// const webpack = require('webpack');
// module.exports = function override(config) {
//     const fallback = config.resolve.fallback || {};
//     Object.assign(fallback, {
//       "crypto": require.resolve("crypto-browserify"),
//       "stream": require.resolve("stream-browserify"),
//       "assert": require.resolve("assert"),
//       "http": require.resolve("stream-http"),
//       "https": require.resolve("https-browserify"),
//       "os": require.resolve("os-browserify"),
//       "url": require.resolve("url")
//       })
//    config.resolve.fallback = fallback;
//    config.plugins = (config.plugins || []).concat([
//      new webpack.ProvidePlugin({
//       process: 'process/browser',
//       Buffer: ['buffer', 'Buffer']
//     })
//    ])
//    return config; }
