require('colors'); // eslint-disable-line
const fs = require('fs');

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
console.log(list.join(' ').magenta);

module.exports = list;
