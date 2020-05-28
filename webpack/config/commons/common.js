require('colors'); // eslint-disable-line
const pja = require('../../../personal-json-accessor');

const personalJson = pja.get();
const appNames = personalJson.appNames;

if (!appNames || appNames.length === 0) {
  console.log('set app-name by app:set'.bgRed.white);
  process.exit(1);
}

const outAppNames = () => {
  console.log('app =>'.cyan);
  appNames.forEach((appName) => console.log(`  ${appName.green}`));
};

const toEntry = () => appNames.reduce((json, key) => {
  json[key] = `./source/${key}.js`;
  return json;
}, {});

const config = {
  entry: toEntry(),
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                '@babel/preset-env',
              ],
            },
          },
        ],
      },
    ],
  },
};

module.exports = {
  config,
  personal: personalJson,
  outAppNames,
};
