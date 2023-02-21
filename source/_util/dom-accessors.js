export const getDataHash = (element) => element.dataset.hash;
export const hasData = (element, name) =>
  Array.from(
    (name ? element : document).querySelectorAll(`[data-${name || element}]`)
  );
const byDataCore = (element, name, value) =>
  Array.from(
    (value ? element : document).querySelectorAll(
      `[data-${name}~="${value || element}"]`
    )
  );
export const byData = (element, name, value) =>
  byDataCore(value ? element : document, value ? name : element, value || name);
const fixElementAndAttr = (element, attr) => ({
  element: attr ? element : document,
  attr: attr || element,
});
export const hasDataTop = (element, name) => hasData(element, name)[0];
export const byDataTop = (element, name, value) =>
  byDataCore(element, name, value)[0];
export const byDataHash = (element, value) =>
  byDataCore(element, 'hash', value);
export const byDataHashTop = (element, value) => byDataHash(element, value)[0];
export const byDataClass = (element, value) =>
  byDataCore(element, 'class', value);
export const byDataClassTop = (element, value) =>
  byDataClass(element, value)[0];
export const byDataAreaId = (value) =>
  byDataCore(document, 'area-id', value)[0];
export const byId = (attr) => document.getElementById(attr);
export const byClass = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByClassName(fixed.attr));
};
export const byTag = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByTagName(fixed.attr));
};
export const byName = (element, attr) => {
  const fixed = fixElementAndAttr(element, attr);
  return Array.from(fixed.element.getElementsByName(fixed.attr));
};

export const domAccessors = {
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

export default {
  domAccessors,
};
