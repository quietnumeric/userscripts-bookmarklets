require('colors');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const { outAppNames, config, personal } = require('./commons/common');
const browsers = require('./commons/browsers');

const {
  appNames,
  serve: {
    port,
    queryHash,
    watch: { staticFiles, saveNothingChanged },
  },
} = personal;

if (port === null) {
  console.log('write port to personal.json(yaml)'.bgRed.white);
  process.exit(1);
}

// とりあえずChromeだけ(personal.jsonで設定できるようにしたいけど)
const { runtime, urlToArg } = browsers.chrome;
appNames.forEach((appName) => {
  spawn(runtime, [
    urlToArg(`http://localhost:${port}/${appName}.html${queryHash || ''}`),
  ]);
});

module.exports = (args) => {
  outAppNames();
  return merge(config, {
    mode: 'development',
    devtool: 'source-map',
    cache: !saveNothingChanged,
    output: {
      path: `${process.cwd()}/mockup/`,
      filename: '[name].js',
    },
    devServer: {
      port,
      contentBase: 'mockup',
      watchContentBase: staticFiles,
    },
  });
};
