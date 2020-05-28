const getDataHash = (element) => element.dataset.hash;
const hasData = (element, name) => Array.from(
  (name ? element : document).querySelectorAll(`[data-${name || element}]`),
);
const byDataCore = (element, name, value) => Array.from(
  (value ? element : document).querySelectorAll(
    `[data-${name}~="${value || element}"]`,
  ),
);
const byData = (element, name, value) => byDataCore(value ? element : document, value ? name : element, value || name);
const fixElementAndAttr = (element, attr) => ({
  element: attr ? element : document,
  attr: attr || element,
});
const hasDataTop = (element, name) => hasData(element, name)[0];
const byDataTop = (element, name, value) => byDataCore(element, name, value)[0];
const byDataHash = (element, value) => byDataCore(element, 'hash', value);
const byDataHashTop = (element, value) => byDataHash(element, value)[0];
const byDataClass = (element, value) => byDataCore(element, 'class', value);
const byDataClassTop = (element, value) => byDataClass(element, value)[0];
const byDataAreaId = (value) => byDataCore(document, 'area-id', value)[0];
const byId = (attr) => document.getElementById(attr);
const byClass = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByClassName(fixed.attr));
};
const byTag = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByTagName(fixed.attr));
};
const byName = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByName(fixed.attr));
};

export const da = {
  getDataHash,
  hasData,
  hasDataTop,
  byDataHash,
  byDataHashTop,
  byData,
  byDataTop,
  byDataClass,
  byDataClassTop,
  byDataAreaId,
  byId,
  byClass,
  byTag,
  byName,
};

export default da;
