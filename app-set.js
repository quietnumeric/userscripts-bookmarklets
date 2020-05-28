require('colors'); // eslint-disable-line
const pja = require('./personal-json-accessor');

function abort(...messages) {
  console.log('error: '.white.bgRed);
  messages.forEach((message) => console.log(message.bgRed.white));
  process.exit(0);
}

const args = process.argv.filter((arg, i) => i > 1);
if (args.length === 0) abort('specify app names.');

console.log('setting app names -> '.cyan);
args.forEach((arg) => console.log(arg.green));
console.log();
console.log('existing app names -> '.cyan);
const list = require('./app-list.js');

console.log();
const invalids = args.filter((arg) => !list.includes(arg));
if (invalids.length > 0) abort('invalid app names -> ', ...invalids);

const personalJson = pja.get();
personalJson.appNames = args;
pja.put(personalJson);

console.log('done set app names.'.green);
