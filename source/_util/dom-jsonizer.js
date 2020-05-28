import da from './../_util/dom-accessor';

export default (idDomJsonOrIdArray, getFunc = da.byId, idProcessFunc = id => id) => {
  const json = {};
  const idArray = Array.isArray(idDomJsonOrIdArray) ?
    idDomJsonOrIdArray : Object.keys(idDomJsonOrIdArray);
  idArray.forEach((id) => {
    json[id] = getFunc(idProcessFunc(id));
  });
  return json;
};
