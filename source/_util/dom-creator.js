const setText = (element, text) => {
  text
    .split('\n')
    .reduce((reducing, line, index) => {
      // ...(index > 0 ? [document.createElement('br')] : []), は避けた
      const elements = [document.createTextNode(line)];
      if (index > 0) elements.unshift(document.createElement('br'));
      return [...reducing, ...elements];
    }, [])
    .forEach((adding) => element.appendChild(adding));
};

const setUnderStairProps = (element, object, propName) =>
  Object.keys(object).forEach((key) => {
    element[propName][key] = object[key];
  });

const propKeysHasUnderStair = {
  data: 'dataset',
  style: 'style',
};

const setProps = (element, props) =>
  Object.keys(props).forEach((key) => {
    const value = props[key];
    const propKeyForUnderStair = propKeysHasUnderStair[key];
    // data・style属性の時は下降
    if (propKeyForUnderStair) {
      setUnderStairProps(element, value, propKeyForUnderStair);
      return;
    }
    element[key] = value;
  });

const debug = (obj) => {
  const doDebug = false;
  if (doDebug) console.log(obj);
};

// どっかからもらった
// Returns true if it is a DOM node
export const isNode = (o) =>
  typeof Node === 'object'
    ? o instanceof Node
    : o &&
      typeof o === 'object' &&
      typeof o.nodeType === 'number' &&
      typeof o.nodeName === 'string';

// どっかからもらった
// Returns true if it is a DOM element
export const isElement = (o) =>
  typeof HTMLElement === 'object'
    ? o instanceof HTMLElement // DOM2
    : o &&
      typeof o === 'object' &&
      o !== null &&
      o.nodeType === 1 &&
      typeof o.nodeName === 'string';

export const addNodes = (parent) => (...children) => {
  if (!children) return parent;
  const childArray = Array.isArray(children[0]) ? children[0] : children;
  childArray.forEach((child) => parent.appendChild(child));
  return parent;
};

const fixArgs = (text, props, children) => {
  // eslint-disable-next-line prefer-rest-params
  if ([text, props, children].every((arg) => !arg)) return null;
  const retObject = {
    text: null,
    children: [],
    props: null,
  };

  const textIsText = typeof text === 'string';
  debug(`textIsText: ${textIsText}`);
  if (textIsText) {
    retObject.text = text;
  }
  // objectとelement配列の判断は、先にelement配列を確定
  // 記法の関係上、 前詰めでelementが渡るとしても、textとprops にelement配列が渡る事はなく、単一elementで渡るはず
  // 3種類の引数のうち、elementとしての有効値が初めて登場したら後は全部element
  // 有効elementより前に見つけたundefinedはelement配列に含めない
  const textIsElement = isElement(text);
  debug(`textIsElement: ${textIsElement}`);
  if (textIsElement) {
    retObject.children.push(text);
    debug(`retObject.children: ${retObject.children.length}`);
  }
  const propsIsElement = isElement(props);
  debug(`propsIsElement: ${propsIsElement}`);
  // textがelementでchildrenもありなら間に挟まっているものはundefinedでもelement想定
  if ((textIsElement && children.length > 0) || propsIsElement) {
    retObject.children.push(props);
    debug(`retObject.children: ${retObject.children.length}`);
  }
  debug(`children: [${children.length}]: ${children}`);
  retObject.children = retObject.children.concat(children);
  debug(`retObject.children: ${retObject.children.length}`);
  // objectの判断は、 text と propObject のみ
  const textIsObject = typeof text === 'object' && !textIsElement;
  const propsIsObject =
    !textIsObject && typeof props === 'object' && !propsIsElement;
  if (textIsObject || propsIsObject) {
    retObject.props = textIsObject ? text : props;
  }
  return retObject;
};

export const dom = (tagName, text, props, ...children) => {
  debug(`▼elm: ${tagName}`);
  const element = document.createElement(tagName);
  const argObject = fixArgs(text, props, children);
  debug(argObject);
  if (!argObject) return element;
  if (argObject.text) setText(element, argObject.text);
  if (argObject.props) setProps(element, argObject.props);
  if (argObject.children.length > 0) addNodes(element)(argObject.children);
  debug(element);
  return element;
};

export const findChild = (obj, returnTrueWhenMatchedFanc) =>
  Array.from(obj.children).find((child) => returnTrueWhenMatchedFanc(child));

export const remove = (element) => {
  element.parentNode.removeChild(element);
};

export const domCreator = {
  dom,
  addNodes,
  findChild,
  remove,
  isElement,
  isNode,
};

export default {
  domCreator,
};
