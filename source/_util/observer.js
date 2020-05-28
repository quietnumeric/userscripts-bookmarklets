const defineProperty = (json, key, innerKey, func) => {
  Object.defineProperty(json, key, {
    get: () => json[innerKey],
    set: (newValue) => {
      if (json[innerKey] === newValue) return;
      json[innerKey] = newValue;
      if (func) func(newValue);
    },
  });
};

export const Observer = (json) => {
  const unbind = (key) => {
    const innerKey = `_${key}`;
    defineProperty(json, key, innerKey);
    // eslint-disable-next-line no-use-before-define
    return { bind, unbind };
  };
  const bind = (key, func) => {
    const innerKey = `_${key}`;
    json[innerKey] = json[key];
    func(json[key]);
    defineProperty(json, key, innerKey, func);
    return { bind, unbind };
  };
  return { bind, unbind };
};

const observedKeys = json => Object.keys(json).filter(key => !key.startsWith('_'));

export const Observed = {
  keys: json => observedKeys(json),
  values: json => observedKeys(json).map(key => json[key]),
};

export default {
  Observer,
  Observed,
};
