/* eslint-disable no-continue */

// どっかからもらった
// Returns true if it is a DOM node
export const isNode = (o) => (typeof Node === 'object'
  ? o instanceof Node
  : o
      && typeof o === 'object'
      && typeof o.nodeType === 'number'
      && typeof o.nodeName === 'string');

// どっかからもらった
// Returns true if it is a DOM element
export const isElement = (o) => (typeof HTMLElement === 'object'
  ? o instanceof HTMLElement // DOM2
  : o
      && typeof o === 'object'
      && o !== null
      && o.nodeType === 1
      && typeof o.nodeName === 'string');

export const addNodes = (parent) => (...child) => {
  if (!child) return parent;
  const children = Array.isArray(child[0]) ? child[0] : child;
  for (let i = 0; i < children.length; i += 1) {
    parent.appendChild(children[i]);
  }
  return parent;
};

export const setText = (element, text) => {
  const argTextLines = text.split('\n');
  for (let i = 0; i < argTextLines.length; i += 1) {
    if (i > 0) {
      element.appendChild(document.createElement('br'));
    }
    const argTextLine = argTextLines[i];
    const textNode = document.createTextNode(argTextLine);
    element.appendChild(textNode);
  }
};

export const setPropsDeepCopy = (element, json, propName) => {
  for (const key in json) {
    element[propName][key] = json[key];
  }
};

export const setProps = (element, propJson) => {
  for (const key in propJson) {
    const value = propJson[key];
    if (key === 'data') {
      // data属性の時は下降
      setPropsDeepCopy(element, value, 'dataset');
      continue;
    }
    if (key === 'style') {
      // style属性の時は下降
      setPropsDeepCopy(element, value, 'style');
      continue;
    }
    element[key] = value;
  }
};

export const debug = (obj) => {
  const doDebug = false;
  if (doDebug) console.log(obj);
};

export function fixArgs(text, props, children) {
  // eslint-disable-next-line prefer-rest-params
  if (!Array.from(arguments).some((arg) => arg)) return null;
  const retJson = {
    text: null,
    children: [],
    props: null,
  };

  const textIsText = typeof text === 'string';
  debug(`textIsText: ${textIsText}`);
  if (textIsText) {
    retJson.text = text;
  }
  // jsonとelement配列の判断は、先にelement配列を確定
  // 記法の関係上、 前詰めでelementが渡るとしても、textとprops にelement配列が渡る事はなく、単一elementで渡るはず
  // 3種類の引数のうち、elementとしての有効値が初めて登場したら後は全部element
  // 有効elementより前に見つけたundefinedはelement配列に含めない
  const textIsElement = isElement(text);
  debug(`textIsElement: ${textIsElement}`);
  if (textIsElement) {
    retJson.children.push(text);
    debug(`retJson.children: ${retJson.children.length}`);
  }
  const propsIsElement = isElement(props);
  debug(`propsIsElement: ${propsIsElement}`);
  // textがelementでchildrenもありなら間に挟まっているものはundefinedでもelement想定
  if ((textIsElement && children.length > 0) || propsIsElement) {
    retJson.children.push(props);
    debug(`retJson.children: ${retJson.children.length}`);
  }
  debug(`children: [${children.length}]: ${children}`);
  retJson.children = retJson.children.concat(children);
  debug(`retJson.children: ${retJson.children.length}`);
  // jsonの判断は、 text と propJson のみ
  const textIsJson = typeof text === 'object' && !textIsElement;
  const propsIsJson = !textIsJson && typeof props === 'object' && !propsIsElement;
  if (textIsJson || propsIsJson) {
    retJson.props = textIsJson ? text : props;
  }
  return retJson;
}

export const dom = (tagName, text, props, ...children) => {
  debug(`▼elm: ${tagName}`);
  const element = document.createElement(tagName);
  const argJson = fixArgs(text, props, children);
  debug(argJson);
  if (!argJson) return element;
  if (argJson.text) setText(element, argJson.text);
  if (argJson.props) setProps(element, argJson.props);
  if (argJson.children.length > 0) addNodes(element)(argJson.children);
  debug(element);
  return element;
};

export const findChild = (obj, returnTrueWhenMatchedFanc) => Array.from(obj.children).find((child) => returnTrueWhenMatchedFanc(child));

export const remove = (element) => {
  element.parentNode.removeChild(element);
};

export default {
  dom,
  addNodes,
  findChild,
  remove,
  isElement,
  isNode,
};
