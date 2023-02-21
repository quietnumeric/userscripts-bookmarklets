const defineProperty = (object, key, innerKey, func) => {
  Object.defineProperty(object, key, {
    get: () => object[innerKey],
    set: (newValue) => {
      if (object[innerKey] === newValue) return;
      object[innerKey] = newValue;
      if (func) func(newValue);
    },
  });
};

export const Observer = (object) => {
  const unbind = (key) => {
    const innerKey = `_${key}`;
    defineProperty(object, key, innerKey);
    // eslint-disable-next-line no-use-before-define
    return { bind, unbind };
  };
  const bind = (key, func) => {
    const innerKey = `_${key}`;
    object[innerKey] = object[key];
    func(object[key]);
    defineProperty(object, key, innerKey, func);
    return { bind, unbind };
  };
  return { bind, unbind };
};

const observedKeys = (object) =>
  Object.keys(object).filter((key) => !key.startsWith('_'));

export const Observed = {
  keys: (object) => observedKeys(object),
  values: (object) => observedKeys(object).map((key) => object[key]),
};

export default {
  Observer,
  Observed,
};
