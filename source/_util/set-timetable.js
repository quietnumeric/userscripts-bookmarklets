export const setTimetable = (...objects) => {
  if (typeof objects[0] === 'number') objects.unshift(() => {});
  function doFunc(i, resolve) {
    objects[i]();
    resolve(objects[i + 1]);
  }
  let promise = null;
  objects.forEach((object, i) => {
    if (i % 2 === 1) return;
    if (i === 0) {
      promise = new Promise((resolve) => {
        doFunc(i, resolve);
      });
      return;
    }
    promise = promise.then(
      (ms) => new Promise((resolve) => {
        setTimeout(() => {
          doFunc(i, resolve);
        }, ms);
      }),
    );
  });
};

export default setTimetable;
