import { arrayToObject } from '../../_util/array-to-object';

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

const durationValueColumnFadeIn = 500;
const durations = {
  general: {
    forward: 300,
    backword: 200,
  },
  outer: {
    open: 1000,
    close: 300,
  },
  head: {
    fadeIn: 200,
  },
  close: {
    fadeIn: 1000,
    fadeInPseudo: 1500,
    fadeInSpin: 500,
  },
  categoryTop: {
    fadeIn: 500,
    fadeInDelay: durationValueColumnFadeIn,
  },
  categoryTopBorder: {
    fadeIn: durationValueColumnFadeIn * 2,
    fadeInDelay: durationValueColumnFadeIn,
  },
  nameColumn: {
    fadeIn: durationValueColumnFadeIn,
    fadeInDelay: durationValueColumnFadeIn * 2 + 200,
  },
  valueColumn: {
    seq: 200,
    fadeIn: durationValueColumnFadeIn,
  },
  valueColumnCover: {
    transform: durationValueColumnFadeIn,
    borderRadius: durationValueColumnFadeIn,
    opacity: durationValueColumnFadeIn * 2,
    delay: durationValueColumnFadeIn,
  },
  copied: {
    add: 100,
    stay: 1500,
    remove: 1000,
  },
};

export const constantsSource = {
  getPrefixedClassNames: (apprefix) =>
    arrayToObject(Object.keys(classNames), (object, key) => {
      object[key] = apprefix(classNames[key]);
    }),
  stateClassNames,
  durations,
};

export default {
  constantsSource,
};
