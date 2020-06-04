module.exports = (commons) => {
  const { log, getAppModuleNames } = commons;

  const modeHas = () => {
    const appModuleNames = getAppModuleNames();
    log(appModuleNames.join(' ').magenta);
  };

  return {
    modeHas,
  };
};
