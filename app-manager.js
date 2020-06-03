require('colors');
const fs = require('fs');
const readline = require('readline');
const pja = require('./personal-json-accessor');

const args = process.argv.filter((arg, i) => i > 2);
const isEmptyArgs = args.length === 0;
const argsTop = args[0];

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

const addSetAppNames = (doingAppNames) => {
  const core = (doingText) => (storeFunc) => {
    if (doingAppNames.length === 0) abort('specify app names.');

    log(`${doingText} app names -> `.cyan);
    doingAppNames.forEach((doingAppName) => log(doingAppName.green));
    logln();
    log('existing app names -> '.cyan);
    const appModuleNames = getAppModuleNames();
    appModuleNames.forEach((appModuleName) => log(appModuleName));

    logln();
    const invalids = doingAppNames.filter(
      (doingAppName) => !appModuleNames.includes(doingAppName),
    );
    if (invalids.length > 0) abort('invalid app names -> ', ...invalids);

    const storedAppNames = storeFunc();

    log(literals.specifiedAppNames.cyan);
    storedAppNames.forEach((appName) => log(appName.green));
    logln();
    log(`done ${doingText} app names.`.green);
  };

  return {
    add: core('adding'),
    set: core('setting'),
  };
};

const addAppNames = (...addingAppNames) => {
  addSetAppNames(addingAppNames).add(() => {
    const appNames = getAppNamesStored();
    addingAppNames
      .filter((adding) => !appNames.includes(adding))
      .forEach((adding) => appNames.push(adding));
    storeAppNames(appNames);
    return appNames;
  });
};

const setAppNames = (...settingAppNames) => {
  addSetAppNames(settingAppNames).set(() => {
    storeAppNames(settingAppNames);
    return settingAppNames;
  });
};

const exists = (filePath) => {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
  return false;
};

const modeNewDelegator = () => {
  const toOneCharOptions = (json) => (line) => json[line.toLowerCase()];
  const yynOptions = toOneCharOptions({
    '': true,
    y: true,
    n: false,
  });

  const directoryNames = {
    b: 'bookmarklets',
    u: 'userscripts',
  };

  const appAddSetConstants = {
    set: 'app:set',
    add: 'app:add',
    not: 'skip modify appNames.',
  };

  const answers = {
    directory: '',
    appFileName: '',
    subDirectory: false,
    subModule: false,
    mockupTempula: false,
    userscriptTempula: false,
    appAddSet: '',
  };

  const answerOptions = {
    directory: toOneCharOptions({
      b: 'b',
      u: 'u',
    }),
    appFileName: (line) => (line === '' ? argsTop : line),
    subDirectory: yynOptions,
    subModule: yynOptions,
    mockupTempula: yynOptions,
    userscriptTempula: yynOptions,
    appAddSet: toOneCharOptions({
      '': appAddSetConstants.set,
      s: appAddSetConstants.set,
      a: appAddSetConstants.add,
      n: appAddSetConstants.not,
    }),
  };
  const toAppName = (appFileName) => `${directoryNames[answers.directory]}/${appFileName}`;
  const toAppNamePath = (appFileName) => `./source/${toAppName(appFileName)}`;
  const toAppFilePath = (appFileName) => `${toAppNamePath(appFileName)}.js`;
  const yynScenatio = ({ ask, myKey, nextKey }) => ({
    ask: `${ask} (y)/n`,
    valid: (answer) => {
      if (answerOptions[myKey](answer) !== undefined) return true;
      log('Empty or requires y or n'.yellow);
      return false;
    },
    nextKey,
  });

  const scenario = {
    directory: {
      ask: 'Which is type bookmarklet or userscript? b/u',
      valid: (answer) => {
        if (answerOptions.directory(answer) !== undefined) return true;
        log('Requires b or u.'.yellow);
        return false;
      },
      nextKey: () => 'appFileName',
    },
    appFileName: {
      ask: `What file name without extension is ?${
        isEmptyArgs ? '' : ` (${argsTop})`
      }`,
      valid: (answer) => {
        if (answer === '' && isEmptyArgs) {
          log('Input.'.yellow);
          return false;
        }
        const settingAnswer = answer === '' ? argsTop : answer;
        const filePath = toAppFilePath(settingAnswer);
        if (!exists(filePath)) return true;
        log(`Exists ${filePath}.`.yellow);
        return false;
      },
      nextKey: () => 'subDirectory',
    },
    subDirectory: yynScenatio({
      ask: 'Generate sub directory?',
      myKey: 'subDirectory',
      nextKey: () => (answers.subDirectory ? 'subModule' : 'mockupTempula'),
    }),
    subModule: yynScenatio({
      ask: 'Generate sample sub module and import?',
      myKey: 'subModule',
      nextKey: () => 'mockupTempula',
    }),
    mockupTempula: yynScenatio({
      ask: 'Generate mockup using tempula?',
      myKey: 'mockupTempula',
      nextKey: () => (answers.directory === answerOptions.directory.b
        ? 'appAddSet'
        : 'userscriptTempula'),
    }),
    userscriptTempula: yynScenatio({
      ask: 'Generate doc.js using tempula?',
      myKey: 'userscriptTempula',
      nextKey: () => 'appAddSet',
    }),
    appAddSet: {
      ask: 'Do app:set or app:add or not? (s)/a/n',
      valid: (answer) => {
        if (answerOptions.appAddSet(answer) !== undefined) return true;
        log('Empty or requires s or a or n'.yellow);
        return false;
      },
      nextKey: () => null,
    },
  };

  const reader = readline.createInterface({
    input: process.stdin, // 標準入力
    output: process.stdout, // 標準出力
  });
  let currentKey = 'directory';

  const fixFileBody = (body) => `${body.trim()}\n`;

  const subFileName = 'sub';
  const createFiles = () => {
    const directoryName = directoryNames[answers.directory];
    const directoryPathSource = `./source/${directoryName}`;
    const appFileName = answers.appFileName;
    const appFilePath = toAppFilePath(appFileName);
    const appFileBody = answers.subModule
      ? `
import { ${subFileName} } from './${appFileName}/${subFileName}';

console.log('${appFileName}');
${subFileName}();
`
      : `
console.log('${appFileName}');
`;
    if (!exists(directoryPathSource)) fs.mkdirSync(directoryPathSource);
    fs.writeFileSync(appFilePath, fixFileBody(appFileBody));
    if (answers.subDirectory) {
      const appNamePath = toAppNamePath(appFileName);
      fs.mkdirSync(appNamePath);
      if (answers.subModule) {
        const subFileBody = `
export const ${subFileName} = () => console.log('${appFileName}.${subFileName}');

export default ${subFileName};
`;
        fs.writeFileSync(
          `${appNamePath}/${subFileName}.js`,
          fixFileBody(subFileBody),
        );
      }
    }
    if (answers.mockupTempula || answers.userscriptTempula) {
      const projectRootPath = process.cwd();
      const replaceTempula = (templateFileName, outputFilePath) => {
        const templateFilePath = `${projectRootPath}/.tempula/${templateFileName}`;
        const src = fs.readFileSync(templateFilePath, 'utf-8');
        const dst = src
          .replace(/@file.?name@/gi, appFileName)
          .replace(/@timestamp@/g, new Date().getTime());
        fs.writeFileSync(outputFilePath, dst);
      };
      const directoryPathMockup = `./mockup/${directoryName}`;
      if (!exists(directoryPathMockup)) fs.mkdirSync(directoryPathMockup);
      if (answers.mockupTempula) {
        replaceTempula(
          'mockup.html',
          `./mockup/${directoryName}/${appFileName}.html`,
        );
      }
      if (answers.userscriptTempula) {
        replaceTempula(
          'userscript.doc.js',
          `./source/${directoryName}/${appFileName}.doc.js`,
        );
      }
    }
  };

  const appAddSet = () => {
    if (answers.appAddSet === appAddSetConstants.not) return;
    logln();
    (answers.appAddSet === appAddSetConstants.set ? setAppNames : addAppNames)(
      toAppName(answers.appFileName),
    );
  };

  const boolToStr = {
    true: 'yes',
    false: 'no',
  };

  // Enterキー押下で読み込み
  reader.on('line', (line) => {
    const current = scenario[currentKey];
    const valid = current.valid;
    if (valid && !valid(line)) {
      log(current.ask.yellow);
      reader.prompt();
      return;
    }

    const answer = answerOptions[currentKey](line);
    answers[currentKey] = answer;
    const boolStr = boolToStr[answer];
    const answerStr = boolStr === undefined ? answer : boolStr; // なぜかor無理
    log(`< ${answerStr}`.green);
    const nextKey = current.nextKey();
    if (!nextKey) {
      logln();
      log('-'.repeat(60).cyan);
      log('Generating as:'.cyan);
      log(answers);
      createFiles();
      appAddSet();
      logln();
      log('+ generated.'.green);
      process.exit(0);
    }
    const next = scenario[nextKey];
    currentKey = nextKey;
    log(next.ask.cyan);
    reader.prompt();
  });

  // ctrl+Cで終了
  reader.on('close', () => {
    log('! canceled.'.yellow);
  });

  // コマンドプロンプトを表示
  const current = scenario[currentKey];
  log(current.ask.cyan);
  reader.prompt();
};

const modeNew = () => {
  modeNewDelegator();
};

const modeNow = () => {
  const appNames = getAppNamesStored();

  if (appNames.length > 0) {
    log(literals.specifiedAppNames.cyan);
    log(appNames.join(' ').green);
    process.exit(0);
  }

  log('nothing specified app names.'.yellow);
  log('specify app names below using npm run app:set'.yellow);

  const appModuleNames = getAppModuleNames();
  log(appModuleNames.join(' ').yellow);
};

const modeAdd = () => addAppNames(...args);

const modeSet = () => setAppNames(...args);

const modeHas = () => {
  const appModuleNames = getAppModuleNames();
  log(appModuleNames.join(' ').magenta);
};

const modeFuncs = {
  new: modeNew, // new は関数名に使えない予約語なので、そこに合わせてmodeつけた
  now: modeNow,
  add: modeAdd,
  set: modeSet,
  has: modeHas,
};

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
