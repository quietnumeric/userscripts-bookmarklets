import { dom, addNodes } from '../_util/dom-creator';
import { appendStyle } from '../_util/append-style';
import { setTimetable } from '../_util/set-timetable';
import { da } from '../_util/dom-accessor';
import { Css } from './url-splitter/css';
import { constants } from './url-splitter/constants';

const appClassName = 'bookmarklet-url-splitter';

const createMaterials = () => {
  const apprefix = (className) => `${appClassName}--${className}`;
  const classNames = constants.getPrefixedClassNames(apprefix);
  const { stateClassNames, intervals } = constants;
  const toActive = (element) => element.classList.add(stateClassNames.active);
  const cancelActive = (element) => element.classList.remove(stateClassNames.active);

  const location = window.location;
  const host = location.host;
  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;

  const paths = pathname.split('/').filter((path) => path !== '');
  const queries = (() => {
    const queriesStr = (search || '').replace(/^\?/, '');
    if (queriesStr === '') return {};
    return queriesStr.split('&').reduce((json, keyValueStr) => {
      const keyAndValue = keyValueStr.split('=');
      const key = keyAndValue[0];
      const value = keyAndValue[1];
      json[key] = value;
      return json;
    }, {});
  })();

  const classon = (...classes) => ({
    className: classes.join(' '),
  });

  const createCopiedMessage = (text) => dom(
    'li',
    classon(classNames.copiedMessage),
    dom('span', 'copied:', classon(classNames.copiedTitle)),
    dom('span', text, classon(classNames.copiedText)),
  );

  const copiedMessages = dom('ul', classon(classNames.copiedMessages));

  const close = dom('div', classon(classNames.close));
  const title = dom('span', 'URL Splitter', classon(classNames.title));
  const head = dom(
    'div',
    classon(classNames.head),
    title,
    copiedMessages,
    close,
  );

  const getSelection = () => window.getSelection().toString();
  const domNameColumn = (text) => dom('span', text, classon(classNames.nameColumn));
  const domValueColumn = (...children) => dom('span', classon(classNames.valueColumn), ...children);
  const domInput = (text) => {
    const inputProps = classon(classNames.text);
    inputProps.type = 'text';
    inputProps.value = text;
    inputProps.readOnly = 'readonly';
    const input = dom('input', inputProps);
    input.addEventListener('mouseup', () => {
      if (getSelection() === '') {
        input.select();
      }
      document.execCommand('copy');
      const copiedStr = getSelection();
      const copiedMessage = createCopiedMessage(copiedStr);

      setTimetable(
        () => copiedMessages.insertBefore(copiedMessage, copiedMessages.firstChild),
        10,
        () => toActive(copiedMessage),
        intervals.copied.stay,
        () => cancelActive(copiedMessage),
        intervals.copied.remove,
        () => copiedMessages.removeChild(copiedMessage),
      );
    });
    return input;
  };
  const liClasson = (index = 0) => (index === 0 ? classon(classNames.categoryTop) : []);
  const ul = dom('ul', classon(classNames.ul));
  const hostLis = [
    dom(
      'li',
      liClasson(),
      domNameColumn('host'),
      domValueColumn(dom('span', classon(classNames.textHost), domInput(host))),
    ),
  ];
  const pathLis = paths.map((path, i) => dom(
    'li',
    liClasson(i),
    domNameColumn(i === 0 ? 'path' : ''),
    domValueColumn(dom('span', classon(classNames.textPath), domInput(path))),
  ));
  const queryLis = Object.keys(queries).map((key, i) => dom(
    'li',
    liClasson(i),
    domNameColumn(i === 0 ? 'query' : ''),
    domValueColumn(
      dom('span', classon(classNames.textQueryKey), domInput(key)),
      dom('span', '=', classon(classNames.textQuerySeparator)),
      dom('span', classon(classNames.textQueryValue), domInput(queries[key])),
    ),
  ));
  const hashLis = hash === ''
    ? []
    : [
      dom(
        'li',
        liClasson(),
        domNameColumn('hash'),
        domValueColumn(
          dom('span', classon(classNames.textHash), domInput(hash)),
          dom('span', '#', classon(classNames.textHashSeparator)),
          dom(
            'span',
            classon(classNames.textHashPlain),
            domInput(hash.replace(/^#/, '')),
          ),
        ),
      ),
    ];
  const lis = [...hostLis, ...pathLis, ...queryLis, ...hashLis];
  addNodes(ul)(...lis);
  const outer = dom('div', classon(appClassName), head, ul);
  close.addEventListener('click', () => {
    cancelActive(outer);
    setTimeout(() => {
      document.body.removeChild(outer);
    }, intervals.outer.close);
  });

  return {
    doms: {
      outer,
      head,
      close,
      lis,
    },
    constants: {
      classNames,
      stateClassNames,
      intervals,
    },
    methods: {
      apprefix,
      toActive,
      cancelActive,
    },
  };
};

const invoke = () => {
  const {
    doms: {
      outer, head, close, lis,
    },
    constants: { classNames, stateClassNames, intervals },
    methods: { apprefix, toActive },
  } = createMaterials();
  addNodes(document.body)(outer);
  setTimetable(
    100,
    () => {
      toActive(outer);
    },
    intervals.outer.open - 100,
    () => {
      toActive(head);
    },
    intervals.head - 100,
    () => {
      toActive(close);
      (function recurse(index = 0) {
        toActive(lis[index]);
        const indexNext = index + 1;
        if (!lis[indexNext]) {
          return;
        }
        setTimeout(() => {
          recurse(indexNext);
        }, intervals.valueColumn.seq);
      })();
    },
  );
  appendStyle(
    Css(appClassName, apprefix, classNames, stateClassNames, intervals),
  );
};

if (da.byClass(appClassName).length === 0) invoke();
