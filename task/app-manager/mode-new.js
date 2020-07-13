const readline = require('readline');
const Project = require('../app-manager-project/mode-new-project');

const doActualGenerating = false;

module.exports = (commons) => (modeAddSet, args) => {
  const { log, logln, GitignoreAccessor } = commons;
  const isEmptyArgs = args.length === 0;
  const argsTop = args[0];

  const modeNew = () => {
    const toOneCharOptions = (json) => (line) => json[line.toLowerCase()];
    const yynOptions = toOneCharOptions({
      '': true,
      y: true,
      n: false,
    });
    const nnyOptions = toOneCharOptions({
      '': false,
      n: false,
      y: true,
    });

    const appAddSetConstants = {
      set: 'app:set',
      add: 'app:add',
      not: 'Skip modify appNames.',
    };

    const toOptionsScene = ({
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

    const isFunction = (obj) => typeof obj === 'function';

    const {
      answers,
      answerOptions,
      scenario,
      createFiles,
      addToGitignore,
      getAppName,
      generatedLog,
    } = Project({
      log,
      logln,
      argsTop,
      isEmptyArgs,
      appAddSetConstants,
      yynOptions,
      nnyOptions,
      toOptionsScene,
      toOneCharOptions,
      fixFileBody,
      subName,
      isFunction,
    });

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let currentKey = Object.keys(scenario)[0];

    const boolToStr = {
      true: 'Yes',
      false: 'No',
    };

    const border = () => '-'.repeat(60);

    return new Promise((resolve, reject) => {
      let closeWithDone = false;
      let appAddSetResolved = false;

      const appAddSet = async () => {
        if (!answers.appAddSet || answers.appAddSet === appAddSetConstants.not)
          return true;
        logln();
        const { modeAdd, modeSet } = modeAddSet(getAppName());
        const resolved = await (answers.appAddSet === appAddSetConstants.set
          ? modeSet
          : modeAdd)().catch((error) => reject(error));
        return resolved;
      };

      const mergeGitignoreStatements = () => {
        const appName = getAppName();

        const gitignore = GitignoreAccessor();
        const updater = gitignore.toUpdater(appName);

        (answers.gitignoreSourcePublic || answers.gitignorePublic
          ? updater.public.ignore
          : updater.public.notice)();
        (answers.gitignoreSourcePublic
          ? updater.source.ignore
          : updater.source.notice)();

        gitignore.write();
      };

      const finalyze = async () => {
        logln();
        log(border().cyan);
        log('Generating as:'.cyan);
        log(answers);
        if (doActualGenerating) {
          createFiles();
          appAddSetResolved = await appAddSet();
          if (!appAddSetResolved) {
            reader.close();
            return;
          }
          if (addToGitignore) mergeGitignoreStatements();
        }

        log(border().cyan);
        logln();
        log('+ Generated.'.green);
        if (generatedLog) generatedLog();
        closeWithDone = true;
        reader.close();
      };

      reader.on('line', async (line) => {
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
          await finalyze();
          return;
        }
        const next = scenario[nextKey];
        currentKey = nextKey;
        const ask = isFunction(next.ask) ? next.ask() : next.ask;
        log(ask.cyan);
        reader.prompt();
      });

      const current = scenario[currentKey];
      log(current.ask.cyan);
      reader.prompt();

      reader.on('close', () => {
        // この条件は「ctrl+Cで終了された時」
        if (!closeWithDone && appAddSetResolved) log('! canceled.'.yellow);
        // appAddSetがrejectされた場合は、このresolveは死に値
        // このモジュールの呼び出し元で既にrejectがcatchされて次の処理が動き出した後になる
        // イベントリスナー系(hoge.on())を扱うとこういうのは仕方なさそう
        return resolve();
      });
    });
  };
  return {
    modeNew,
  };
};
