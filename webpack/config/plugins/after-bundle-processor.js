require('colors');
const fs = require('fs-extra');
const path = require('path');

const { bundleFileName } = require('../commons/constants');

const wrap = (body, separator = '') => ['(function() {', body, '})();'].join(separator);

const exists = (filePath) => {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
  return false;
};

const processors = {
  bookmarklets: (outputFileBody) => `javascript:${wrap(outputFileBody)}`,
  userscripts: (outputFileBody, sourceFilePath) => {
    const sourceDocFilePath = sourceFilePath.replace(/\.js$/, '.doc.js');
    if (!exists(sourceDocFilePath)) {
      console.log(`Doc file is not found: ${sourceDocFilePath}`.bgRed.white);
      return null;
    }
    const sourceDocFileBody = fs.readFileSync(sourceDocFilePath);
    return [sourceDocFileBody, wrap(outputFileBody, '\n')].join('\n').trim();
  },
};

const fileNameRegExp = new RegExp(`${bundleFileName}.js$`);
const toReadmePaths = (outputFilePath) => ({
  dir: outputFilePath.replace(fileNameRegExp, '.readme'),
  md: outputFilePath.replace(fileNameRegExp, 'README.md'),
});

const processor = (entry, name, outputFilePathTemplate) => {
  const outputFilePath = outputFilePathTemplate.replace(/\[name\]/, name);
  const outputFileBody = fs.readFileSync(outputFilePath);
  const splittedName = name.split('/');
  const directory = splittedName[0];
  const app = splittedName[1];
  const outputFileBodyFixedFunc = {
    bookmarklets: () => processors.bookmarklets(outputFileBody),
    userscripts: () => processors.userscripts(outputFileBody, entry[name]),
  }[directory];
  if (!outputFileBodyFixedFunc) return;
  fs.writeFileSync(outputFilePath, outputFileBodyFixedFunc());
  const readMePaths = toReadmePaths(outputFilePath);
  if (!exists(readMePaths.dir)) fs.mkdirSync(readMePaths.dir);
  if (!exists(readMePaths.md)) {
    fs.writeFileSync(
      readMePaths.md,
      `###### ${directory}

# ${app}
`,
    );
  }
};

class AfterBundleProcessor {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('AfterBundleProcessor', (compilation) => {
      const {
        options: {
          output: { path: directoryPath, filename: fileName },
        },
      } = compilation;
      const outputFilePathTemplate = path.resolve(directoryPath, fileName);
      const entry = compilation.options.entry;
      Object.keys(entry).forEach((name) => processor(entry, name, outputFilePathTemplate));
    });
  }
}

module.exports = { AfterBundleProcessor };
