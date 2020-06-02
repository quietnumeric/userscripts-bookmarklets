require('colors'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const { outAppNames, config } = require('./commons/common');
const { bundleFileName } = require('./commons/constants');
const { AfterBundleProcessor } = require('./plugins/after-bundle-processor');

module.exports = (args) => {
  if (!args || !args.dev) outAppNames();
  return merge(config, {
    mode: 'production',
    output: {
      path: `${process.cwd()}/distribution/`,
      filename: `[name]/${bundleFileName}.js`,
    },
    watch: true,
    plugins: [new AfterBundleProcessor()],
  });
};
