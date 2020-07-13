const fs = require('fs');

module.exports = ({
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
  subName: subFileName,
  isFunction,
}) => {
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
    appAddSet: '',
  };
  const answerOptions = {
    directory: toOneCharOptions({
      b: 'b',
      u: 'u',
    }),
    appFileName: (line) => (line === '' ? argsTop : line),
    subDirectory: nnyOptions,
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

  const toAppName = (appFileName) =>
    `${directoryNames[answers.directory]}/${appFileName}`;
  const toAppNamePath = (appFileName) => `./source/${toAppName(appFileName)}`;
  const toAppFilePath = (appFileName) => `${toAppNamePath(appFileName)}.js`;

  const toDefaultAnotherOptionSceneMessages = (
    defaultOption,
    anotherOption
  ) => ({
    toAskTemplate: (ask) =>
      isFunction(ask)
        ? () => `${ask()} (${defaultOption})/${anotherOption}`
        : `${ask} (${defaultOption})/${anotherOption}`,
    toInvalidLogBody: () =>
      `Empty or requires ${defaultOption} or ${anotherOption}`.yellow,
  });

  const yynScene = toOptionsScene({
    ...toDefaultAnotherOptionSceneMessages('y', 'n'),
    answerOptions,
  });

  const nnyScene = toOptionsScene({
    ...toDefaultAnotherOptionSceneMessages('n', 'y'),
    answerOptions,
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
        if (!fs.existsSync(filePath)) return true;
        log(`Exists ${filePath}.`.yellow);
        return false;
      },
      nextKey: () => 'subDirectory',
    },
    subDirectory: nnyScene({
      ask: 'Generate sub directory?',
      myKey: 'subDirectory',
      nextKey: () => (answers.subDirectory ? 'subModule' : 'mockupTempula'),
    }),
    subModule: yynScene({
      ask: 'Generate sample sub module and import?',
      myKey: 'subModule',
      nextKey: () => 'mockupTempula',
    }),
    mockupTempula: yynScene({
      ask: 'Generate mockup using tempula?',
      myKey: 'mockupTempula',
      nextKey: () =>
        answers.directory === answerOptions.directory.b
          ? 'appAddSet'
          : 'userscriptTempula',
    }),
    userscriptTempula: yynScene({
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
    if (!fs.existsSync(directoryPathSource)) fs.mkdirSync(directoryPathSource);
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
          fixFileBody(subFileBody)
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
      if (!fs.existsSync(directoryPathMockup))
        fs.mkdirSync(directoryPathMockup);
      if (answers.mockupTempula) {
        replaceTempula(
          'mockup.html',
          `./mockup/${directoryName}/${appFileName}.html`
        );
      }
      if (answers.userscriptTempula) {
        replaceTempula(
          'userscript.doc.js',
          `./source/${directoryName}/${appFileName}.doc.js`
        );
      }
    }
  };
  const getAppName = () => toAppName(answers.appFileName);
  return {
    directoryNames,
    answers,
    answerOptions,
    scenario,
    createFiles,
    getAppName,
  };
};
