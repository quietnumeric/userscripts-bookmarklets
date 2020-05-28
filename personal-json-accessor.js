const fs = require('fs');
// 扱うファイルがjsonであれyamlであれjsから見ればjsonなのでpersonal-json-accessor

const usingExt = 'yaml';

const accessors = {
  json: () => ({
    jsonToFile: (json) => JSON.stringify(json),
    fileToJson: (file) => JSON.parse(file),
  }),
  yaml: () => {
    // ほんとはやったらあかんやつ
    const yaml = require('js-yaml'); // eslint-disable-line
    return {
      jsonToFile: (json) => yaml.dump(json),
      fileToJson: (file) => yaml.safeLoad(file),
    };
  },
};
accessors.yml = accessors.yaml;

const { jsonToFile, fileToJson } = accessors[usingExt]();

const name = `personal.${usingExt}`;
function put(
  json = {
    appNames: [],
  },
) {
  fs.writeFileSync(name, jsonToFile(json));
}
function create() {
  put();
  return get(); // eslint-disable-line no-use-before-define
}
function get() {
  try {
    return fileToJson(fs.readFileSync(name));
  } catch (err) {
    if (err.message.startsWith('ENOENT:')) return create();
  }
  return null;
}
module.exports = { get, put };
