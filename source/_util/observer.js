export const Observer = (entity) => {
  const bind = (key, maySet, mayGet) => {
    const accessors =
      typeof maySet === 'object'
        ? {
            set: maySet.set || (() => {}),
            get: maySet.get || ((currentValue) => currentValue),
          }
        : {
            set: maySet,
            get: mayGet || ((currentValue) => currentValue),
          };

    const entityKey = `_${key}`;
    entity[entityKey] = entity[key];
    accessors.set(entity[key]);
    Object.defineProperty(entity, key, {
      get: () => accessors.get(entity[entityKey]),
      set: (newValue) => {
        if (entity[entityKey] === newValue) return;
        entity[entityKey] = newValue;
        accessors.set(newValue);
      },
    });
    return { bind };
  };
  return { bind };
};

const observedKeys = (entity) =>
  Object.keys(entity).filter((key) => !key.startsWith('_'));

export const Observed = {
  keys: (entity) => observedKeys(entity),
  values: (entity) => observedKeys(entity).map((key) => entity[key]),
};

export default {
  Observer,
  Observed,
};
