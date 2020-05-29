require('colors'); // eslint-disable-line
const fs = require('fs');
const readline = require('readline');
const pja = require('./personal-json-accessor');
const { createFile } = require('./tempula-core');

const log = (obj) => console.log(obj);
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

const addSet = () => {
  const core = (doingText) => (storeFunc) => {
    const args = process.argv.filter((arg, i) => i > 2);
    if (args.length === 0) abort('specify app names.');

    log(`${doingText} app names -> `.cyan);
    args.forEach((arg) => log(arg.green));
    log();
    log('existing app names -> '.cyan);
    const appModuleNames = getAppModuleNames();
    appModuleNames.forEach((appName) => log(appName));

    log();
    const invalids = args.filter((arg) => !appModuleNames.includes(arg));
    if (invalids.length > 0) abort('invalid app names -> ', ...invalids);

    const storedAppNames = storeFunc(args);

    log(literals.specifiedAppNames.cyan);
    storedAppNames.forEach((appName) => log(appName.green));
    log();
    log(`done ${doingText} app names.`.green);
  };

  return {
    add: core('adding'),
    set: core('setting'),
  };
};

const modeAdd = () => {
  addSet().add((args) => {
    const appNames = getAppNamesStored();
    args
      .filter((adding) => !appNames.includes(adding))
      .forEach((adding) => appNames.push(adding));
    storeAppNames(appNames);
    return appNames;
  });
};

const modeSet = () => {
  addSet().set((args) => {
    storeAppNames(args);
    return args;
  });
};

const modeHas = () => {
  const appModuleNames = getAppModuleNames();
  log(appModuleNames.join(' ').magenta);
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

const modeNew = () => {
  const exists = (filePath) => {
    try {
      fs.statSync(filePath);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }
    return false;
  };

  const yynOptions = () => ({
    '': true,
    y: true,
    n: false,
  });

  const directoryNames = {
    b: 'bookmarklets',
    u: 'userscripts',
  };
  const answers = {
    directory: '',
    appFileName: '',
    subDirectory: false,
    subModule: false,
    mockupTempula: false,
    userscriptTempula: false,
  };
  const answerOptions = {
    directory: {
      b: 'b',
      u: 'u',
    },
    subDirectory: yynOptions(),
    subModule: yynOptions(),
    mockupTempula: yynOptions(),
    userscriptTempula: yynOptions(),
  };
  const toAppNamePath = (appFileName) => `./source/${directoryNames[answers.directory]}/${appFileName}`;
  const toAppFilePath = (appFileName) => `${toAppNamePath(appFileName)}.js`;
  const yynScenatio = ({ ask, myKey, nextKey }) => ({
    ask: `${ask} (y)/n`,
    valid: (answer) => {
      if (Object.keys(answerOptions[myKey]).includes(answer.toLowerCase())) return true;
      log('Empty or requires y or n'.yellow);
      return false;
    },
    nextKey,
  });

  const scenario = {
    directory: {
      ask: 'Which is type bookmarklet or userscript? b/u',
      valid: (answer) => {
        if (answerOptions.directory[answer.toLowerCase()]) return true;
        log('Requires b or u.'.yellow);
        return false;
      },
      nextKey: () => 'appFileName',
    },
    appFileName: {
      ask: 'What file name is(without extension)?',
      valid: (answer) => {
        const filePath = toAppFilePath(answer);
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
        ? null
        : 'userscriptTempula'),
    }),
    userscriptTempula: yynScenatio({
      ask: 'Generate doc.js using tempula?',
      myKey: 'userscriptTempula',
      nextKey: () => null,
    }),
  };

  const reader = readline.createInterface({
    input: process.stdin, // 標準入力
    output: process.stdout, // 標準出力
  });
  let currentKey = 'directory';

  const subFileName = 'sub';
  const createFiles = () => {
    const toFileBodyLogStatement = (...fileNames) => `console.log('${fileNames.join('.')}')`;
    const appFileName = answers.appFileName;
    const appFilePath = toAppFilePath(appFileName);
    const appFileNameLogStatement = toFileBodyLogStatement(appFileName);
    const appFileBodyLines = answers.subModule
      ? [
        `import { ${subFileName} } from './${appFileName}/${subFileName}';`,
        '',
        `${appFileNameLogStatement};`,
        `${subFileName}();`,
        '',
      ]
      : [`${appFileNameLogStatement};`, ''];
    fs.writeFileSync(appFilePath, appFileBodyLines.join('\n'));
    if (answers.subDirectory) {
      const appNamePath = toAppNamePath(appFileName);
      fs.mkdirSync(appNamePath);
      if (answers.subModule) {
        const subFileBodyLines = [
          `export const ${subFileName} = () => ${toFileBodyLogStatement(
            appFileName,
            subFileName,
          )};`,
          '',
          `export default ${subFileName};`,
          '',
        ];
        fs.writeFileSync(
          `${appNamePath}/${subFileName}.js`,
          subFileBodyLines.join('\n'),
        );
      }
    }
    if (answers.mockupTempula || answers.userscriptTempula) {
      const projectRootPath = process.cwd();
      const directoryName = directoryNames[answers.directory];
      const replaceTempula = (templateFileName, outputFilePath) => {
        const templateFilePath = `${projectRootPath}/.tempula/${templateFileName}`;
        const src = fs.readFileSync(templateFilePath, 'utf-8');
        const dst = src
          .replace(/@file.?name@/gi, appFileName)
          .replace(/@timestamp@/g, new Date().getTime());
        fs.writeFileSync(outputFilePath, dst);
      };
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

  // Enterキー押下で読み込み
  reader.on('line', (line) => {
    const current = scenario[currentKey];
    const valid = current.valid;
    if (valid && !valid(line)) {
      log(current.ask.yellow);
      reader.prompt();
      return;
    }

    const answerOption = answerOptions[currentKey];
    answers[currentKey] = answerOption ? answerOption[line] : line;
    log(answers);
    const nextKey = current.nextKey();
    if (!nextKey) {
      log(answers);
      createFiles();
      log('generated.'.green);
      process.exit(0);
    }
    const next = scenario[nextKey];
    currentKey = nextKey;
    log(next.ask.cyan);
    reader.prompt();
  });

  // ctrl+Cで終了
  reader.on('close', () => {
    log('canceled.'.yellow);
  });

  // コマンドプロンプトを表示
  const current = scenario[currentKey];
  log(current.ask.cyan);
  reader.prompt();
};

const modeFuncs = {
  add: modeAdd,
  set: modeSet,
  has: modeHas,
  now: modeNow,
  new: modeNew, // new は関数名に使えない予約語なので、そこに合わせてmodeつけた
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
