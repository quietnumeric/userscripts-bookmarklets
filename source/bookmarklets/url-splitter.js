import { addNodes } from '../_util/dom-creator';
import { appendStyle } from '../_util/append-style';
import { setTimetable } from '../_util/set-timetable';
import { domAccessors } from '../_util/dom-accessors';
import { createMaterials } from './url-splitter/create-materials';
import { createStyle } from './url-splitter/create-style';

const appClassName = 'bookmarklet-url-splitter';

const invoke = () => {
  const {
    doms: { outer, head, close, lis },
    constants: { classNames, stateClassNames, durations },
    methods: { apprefix, toActive },
  } = createMaterials(appClassName);
  appendStyle(
    createStyle(appClassName, apprefix, classNames, stateClassNames, durations)
  );
  addNodes(document.body)(outer);
  setTimetable(
    100,
    () => {
      toActive(outer);
    },
    durations.outer.open - 200,
    () => {
      toActive(head);
    },
    durations.head - 100,
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
        }, durations.valueColumn.seq);
      })();
    }
  );
};

if (domAccessors.byClass(appClassName).length === 0) invoke();
