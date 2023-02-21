export const arrayToObject = (
  array,
  // eslint-disable-next-line no-unused-vars
  reducer = (creatingObject, arrayElement, index, sourceArray) => {
    creatingObject[arrayElement] = arrayElement;
  }
) =>
  array.reduce(
    (creatingObject, arrayElement, index, sourceArray) => ({
      ...(reducer(creatingObject, arrayElement, index, sourceArray) ||
        creatingObject),
    }),
    {}
  );

export default {
  arrayToObject,
};
