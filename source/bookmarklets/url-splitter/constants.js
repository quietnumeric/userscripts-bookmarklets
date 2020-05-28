import { arrayToJson } from '../../_util/array-to-json';

const classNames = {
  head: 'head',
  title: 'title',
  copiedMessages: 'copied-messages',
  copiedMessage: 'copied-message',
  copiedTitle: 'copied-title',
  copiedText: 'copied-text',
  close: 'close',
  ul: 'ul',
  categoryTop: 'category-top',
  nameColumn: 'name-column',
  valueColumn: 'value-column',
  text: 'text',
  textHost: 'text-host',
  textPath: 'text-path',
  textQuery: 'text-query',
  textQueryKey: 'text-query-key',
  textQuerySeparator: 'text-query-separator',
  textQueryValue: 'text-query-value',
  textHash: 'text-hash',
  textHashSeparator: 'text-hash-separator',
  textHashPlain: 'text-hash-plain',
};

const stateClassNames = {
  active: 'active',
};

const intervals = {
  outer: {
    open: 500,
    close: 200,
  },
  head: 200,
  valueColumn: {
    seq: 200,
    fadeIn: 500,
  },
  copied: {
    add: 100,
    stay: 1500,
    remove: 1000,
  },
};

export const constants = {
  getPrefixedClassNames: (apprefix) => arrayToJson(Object.keys(classNames), (json, key) => {
    json[key] = apprefix(classNames[key]);
  }),
  stateClassNames,
  intervals,
};

export default constants;
