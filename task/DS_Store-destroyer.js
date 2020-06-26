const fs = require('fs');
const path = require('path');
const readline = require('readline');

const excludingAbsoluteDirPaths = ['.git', './node_modules'];

const destroyingFileName = '.DS_Store';
const excludingNormalizedAbsoluteDirPaths = excludingAbsoluteDirPaths.map(
  (dirPath) => path.normalize(dirPath)
);

const recurseGetDsStorePaths = (currentPath, dsStorePaths = []) =>
  fs
    .readdirSync(currentPath)
    .map((name) => path.join(currentPath, name))
    .filter(
      (filePath) => !excludingNormalizedAbsoluteDirPaths.includes(filePath)
    )
    .reduce((array, filePath) => {
      if (fs.statSync(filePath).isFile()) {
        if (filePath.endsWith(destroyingFileName)) array.push(filePath);
        return array;
      }
      return recurseGetDsStorePaths(filePath, array);
    }, dsStorePaths);

const exit = () => {
  console.log('');
  process.exit(0);
};

const log = (str) => console.log(`${'-'.repeat(10)} ${str}`);

console.log('');
console.log('DS_Store-destroyer =>');

const dsStorePaths = recurseGetDsStorePaths('./');

if (dsStorePaths.length === 0) {
  log('No .DS_Store.');
  exit();
}

console.log(dsStorePaths);

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

log('Remove? y/n');

reader.on('line', (line) => {
  if (line.toLowerCase() !== 'y') {
    log('Canceled.');
    exit();
  }
  dsStorePaths.forEach((dsStorePath) => fs.unlinkSync(dsStorePath));
  log('Done.');
  exit();
});

reader.on('close', exit);

reader.prompt();
