require('colors');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const { outTitledElements, config, personal } = require('./commons/common');
const { browsers } = require('./commons/browsers');

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

const urls = appNames.reduce((reducing, appName) => {
  const plainUrl = `http://localhost:${port}/${appName}.html`;
  const reducingNext = [...reducing, plainUrl];
  if (queryHash) reducingNext.push(plainUrl + queryHash);
  return reducingNext;
}, []);

// WSLからは動かしにくい
// とりあえずChromeだけ(personal.jsonで設定できるようにしたいけど)
// const { runtime, urlToArg } = browsers.chrome;
// urls.forEach((url) => {
//   spawn(runtime, [urlToArg(url)]);
// });

module.exports = (args) => {
  outTitledElements('url', urls);
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
