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

const names = {
  default: `personal.default.${usingExt}`,
  personal: `personal.${usingExt}`,
};

const put = (json) => {
  fs.writeFileSync(names.personal, jsonToFile(json));
};
const create = () => {
  const defaultJson = fileToJson(fs.readFileSync(names.default));
  put(defaultJson);
  console.log(`${names.personal} was copied from ${names.default}.`);
  return get(); // eslint-disable-line no-use-before-define
};
const get = () => {
  try {
    return fileToJson(fs.readFileSync(names.personal));
  } catch (err) {
    if (err.message.startsWith('ENOENT:')) return create();
  }
  return null;
};
module.exports = { get, put };
