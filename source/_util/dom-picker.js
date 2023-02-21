import { byId } from './dom-accessors';
import { arrayToObject } from './array-to-object';

export const domPicker = (
  idDomObjectOrIdArray,
  domGetter = byId,
  idProcessor = (id) => id
) => {
  const idArray = Array.isArray(idDomObjectOrIdArray)
    ? idDomObjectOrIdArray
    : Object.keys(idDomObjectOrIdArray);
  return arrayToObject(idArray, (object, id, index, array) => {
    object[id] = domGetter(idProcessor(id, index, array));
  });
};

export default {
  domPicker,
};
