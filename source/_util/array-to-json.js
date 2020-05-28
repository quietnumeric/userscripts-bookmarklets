export const arrayToJson = (array, reduceFunc = (json, key) => {}) => array.reduce((json, key) => {
  const returnedJson = reduceFunc(json, key);
  return returnedJson || json;
}, {});

export default arrayToJson;
