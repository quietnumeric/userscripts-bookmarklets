require('colors'); // eslint-disable-line
const pja = require('./personal-json-accessor');

const appNames = pja.get().appNames;

if (appNames.length > 0) {
  console.log('specified app names -> '.cyan);
  console.log(appNames.join(' ').green);
  process.exit(0);
}

console.log('nothing specified app names.'.yellow);
console.log('specify app names below using npm run app:set'.yellow);
require('./app-list.js');

module.exports = appNames;
