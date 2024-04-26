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
    url: require.resolve("url"),
    querystring: require.resolve("querystring-es3"),
    vm: require.resolve("vm-browserify"),
    'process/browser': require.resolve('process/browser')
  });
  config.resolve.fallback = fallback;

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  ];
  return config;
};
