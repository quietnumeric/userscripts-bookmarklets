const fs = require('fs');
const readline = require('readline');
const Project = require('./mode-new-project');

module.exports = (commons) => (modeAddSet, args) => {
  const { log, logln } = commons;
  const isEmptyArgs = args.length === 0;
  const argsTop = args[0];

  const exists = (filePath) => {
    try {
      fs.statSync(filePath);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }
    return false;
  };

  const modeNew = () => {
    const toOneCharOptions = (json) => (line) => json[line.toLowerCase()];
    const yynOptions = toOneCharOptions({
      '': true,
      y: true,
      n: false,
    });

    const appAddSetConstants = {
      set: 'app:set',
      add: 'app:add',
      not: 'Skip modify appNames.',
    };

    const toYynScene = ({
      toAskTemplate,
      toInvalidLogBody,
      answerOptions,
    }) => ({ ask, myKey, nextKey }) => ({
      ask: toAskTemplate(ask),
      valid: (answer) => {
        if (answerOptions[myKey](answer) !== undefined) return true;
        log(toInvalidLogBody());
        return false;
      },
      nextKey,
    });

    const fixFileBody = (body) => `${body.trim()}\n`;

    const subName = 'sub';

    const {
      answers,
      answerOptions,
      scenario,
      createFiles,
      getAppName,
    } = Project({
      log,
      logln,
      argsTop,
      isEmptyArgs,
      appAddSetConstants,
      yynOptions,
      toYynScene,
      toOneCharOptions,
      exists,
      fixFileBody,
      subName,
    });

    const reader = readline.createInterface({
      input: process.stdin, // 標準入力
      output: process.stdout, // 標準出力
    });
    let currentKey = Object.keys(scenario)[0];

    const appAddSet = () => {
      if (answers.appAddSet === appAddSetConstants.not) return;
      logln();
      const { modeAdd, modeSet } = modeAddSet(getAppName());
      (answers.appAddSet === appAddSetConstants.set ? modeSet : modeAdd)();
    };

    const boolToStr = {
      true: 'Yes',
      false: 'No',
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
  return {
    modeNew,
  };
};
