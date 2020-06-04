const fs = require('fs');
const pja = require('../../personal-json-accessor');

const log = (obj) => console.log(obj);
const logln = () => log('');

const getAppModuleNames = () => {
  const expects = ['_util'];
  const source = 'source';
  const directories = fs.readdirSync(source);
  const list = [];
  directories
    .filter((directory) => !expects.includes(directory))
    .forEach((directory) => {
      fs.readdirSync(`${source}/${directory}`)
        .filter((name) => name.match(/\..+$/) && !name.match(/\.doc\.js$/))
        .map((name) => name.replace(/\..+$/, ''))
        .forEach((name) => list.push(`${directory}/${name}`));
    });
  return list;
};

const literals = {
  specifiedAppNames: 'specified app names -> ',
};

const storeAppNames = (appNames) => {
  const personalJson = pja.get();
  personalJson.appNames = appNames;
  pja.put(personalJson);
};

const getAppNamesStored = () => pja.get().appNames || [];

const abort = (...messages) => {
  log('Error: '.white.bgRed);
  messages.forEach((message) => log(message.white.bgRed));
  process.exit(0);
};

module.exports = {
  log,
  logln,
  getAppModuleNames,
  literals,
  storeAppNames,
  getAppNamesStored,
  abort,
};
