require('colors');
const ModeAddSet = require('./app-manager/mode-add-set');
const ModeHas = require('./app-manager/mode-has');
const ModeNew = require('./app-manager/mode-new');
const ModeNow = require('./app-manager/mode-now');
const commons = require('./app-manager/commons');

const args = process.argv.filter((arg, i) => i > 2);

const modeAddSet = ModeAddSet(commons);

const { modeAdd, modeSet } = modeAddSet(...args);
const { modeHas } = ModeHas(commons);
const { modeNew } = ModeNew(commons)(modeAddSet, args);
const { modeNow } = ModeNow(commons);

const modeFuncs = {
  add: modeAdd,
  set: modeSet,
  has: modeHas,
  new: modeNew, // new は関数名に使えない予約語なので、そこに合わせてmodeつけた
  now: modeNow,
};

const { log, abort } = commons;

const argToMode = (arg) => {
  const modes = Object.keys(modeFuncs);
  const exit = () => {
    log('app-manager'.magenta);
    abort(`Error: Pass arg one of [${modes.join(', ')}].`);
  };
  if (!arg) exit();
  const mode = arg.replace(/^-+/, '');
  if (!modes.includes(mode)) exit();
  return mode;
};

const main = () => {
  const arg = process.argv[2];
  const mode = argToMode(arg);
  log(`app-manager[${mode}]`.magenta);
  modeFuncs[mode]();
};

main();
