module.exports = (commons) => {
  const { log, getAppModuleNames } = commons;

  const modeHas = () =>
    new Promise((resolve) => {
      const appModuleNames = getAppModuleNames();
      log(appModuleNames.join(' ').green);
      return resolve();
    });

  return {
    modeHas,
  };
};
