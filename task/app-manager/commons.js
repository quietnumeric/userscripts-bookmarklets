const fs = require('fs');
const pja = require('../../personal-json-accessor');

const log = (obj) => console.log(obj);
const logln = () => log('');

const getAppModuleNames = () =>
  fs
    .readdirSync('source/js')
    .filter((name) => name.match(/\.js$/))
    .map((name) => name.replace(/\..+$/, ''));

const literals = {
  specifiedAppNames: 'specified app names -> ',
};

const storeAppNames = (appNames) => {
  const personalJson = pja.get();
  personalJson.appNames = appNames;
  pja.put(personalJson);
};

const getAppNamesStored = () => pja.get().appNames || [];

module.exports = {
  log,
  logln,
  getAppModuleNames,
  literals,
  storeAppNames,
  getAppNamesStored,
};
