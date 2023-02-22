import { dom } from '../../_util/dom-creator';
import { setTimetable } from '../../_util/set-timetable';
import { constantsSource } from './constants-source';

const { stateClassNames, durations } = constantsSource;
const toActive = (element) => element.classList.add(stateClassNames.active);
const cancelActive = (element) =>
  element.classList.remove(stateClassNames.active);
const classon = (...classes) => ({
  className: classes.join(' '),
});
const getSelectedText = () => window.getSelection().toString();
const cancelSelect = () => window.getSelection().removeAllRanges();

export const createMaterials = (appClassName) => {
  // HistoryAPIでの書き換えにも対応したいので、毎回取得
  const location = window.location;
  const host = location.host;
  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;
  const paths = pathname.split('/').filter((path) => path !== '');
  const queries = (() => {
    const queriesStr = (search || '').replace(/^\?/, '');
    if (queriesStr === '') return {};
    return queriesStr.split('&').reduce((object, keyValueStr) => {
      const keyAndValue = keyValueStr.split('=');
      const key = keyAndValue[0];
      const value = keyAndValue[1];
      object[key] = value;
      return object;
    }, {});
  })();

  const apprefix = (className) => `${appClassName}--${className}`;
  const classNames = constantsSource.getPrefixedClassNames(apprefix);

  const close = dom('div', classon(classNames.close));
  const title = dom('span', 'URL Splitter', classon(classNames.title));
  const head = dom('div', classon(classNames.head), title, close);
  const domNameColumn = (text) =>
    dom('span', text, classon(classNames.nameColumn));
  const domValueColumn = (...children) =>
    dom('span', classon(classNames.valueColumn), ...children);
  const domInput = (text) => {
    const inputProps = classon(classNames.text);
    inputProps.type = 'text';
    inputProps.value = text;
    inputProps.readOnly = 'readonly';
    const input = dom('input', inputProps);
    input.addEventListener('mouseup', () => {
      const selected = getSelectedText();
      if (selected === input.value) {
        cancelSelect();
        return;
      }
      if (selected === '') input.select();
      const copiedText = getSelectedText();
      const copiedThen = () => {
        const copiedMessage = dom(
          'div',
          copiedText,
          classon(classNames.copiedMessage)
        );
        const style = copiedMessage.style;
        const top = input.clientTop - 12;
        const left = input.clientLeft + 21;
        style.top = `${top}px`;
        style.left = `${left}px`;
        const parent = input.parentNode;
        setTimetable(
          () => parent.appendChild(copiedMessage),
          100,
          () => toActive(copiedMessage),
          durations.copied.stay,
          () => cancelActive(copiedMessage),
          durations.copied.remove,
          () => parent.removeChild(copiedMessage)
        );
      };
      // async/awaitを使えるようにするのはブックマークレットには不向き
      // _util/using-async-await.js 参照
      navigator.clipboard.writeText(copiedText).then(copiedThen);
    });
    return input;
  };
  const liClasson = (index = 0) =>
    index === 0 ? classon(classNames.categoryTop) : [];
  const hostLis = [
    dom(
      'li',
      liClasson(),
      domNameColumn('host'),
      domValueColumn(dom('span', classon(classNames.textHost), domInput(host)))
    ),
  ];
  const pathLis = paths.map((path, i) =>
    dom(
      'li',
      liClasson(i),
      domNameColumn(i === 0 ? 'path' : ''),
      domValueColumn(dom('span', classon(classNames.textPath), domInput(path)))
    )
  );
  const queryLis = Object.keys(queries).map((key, i) =>
    dom(
      'li',
      liClasson(i),
      domNameColumn(i === 0 ? 'query' : ''),
      domValueColumn(
        dom('span', classon(classNames.textQueryKey), domInput(key)),
        dom('span', '=', classon(classNames.textQuerySeparator)),
        dom('span', classon(classNames.textQueryValue), domInput(queries[key]))
      )
    )
  );
  const hashLis =
    hash === ''
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
                domInput(hash.replace(/^#/, ''))
              )
            )
          ),
        ];
  const lis = [...hostLis, ...pathLis, ...queryLis, ...hashLis];
  const ul = dom('ul', classon(classNames.ul), ...lis);
  const outer = dom('div', classon(appClassName), head, ul);
  close.addEventListener('click', () => {
    cancelActive(outer);
    setTimeout(() => {
      document.body.removeChild(outer);
    }, durations.outer.close);
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
      durations,
    },
    methods: {
      apprefix,
      toActive,
      cancelActive,
    },
  };
};

export default {
  createMaterials,
};
