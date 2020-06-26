module.exports = (commons) => {
  const { log, literals, getAppNamesStored, getAppModuleNames } = commons;
  const modeNow = () =>
    new Promise((resolve) => {
      const appNames = getAppNamesStored();

      if (appNames.length > 0) {
        log(literals.specifiedAppNames.cyan);
        log(appNames.join(' ').green);
        return resolve();
      }

      log('nothing specified app names.'.yellow);
      log('specify app names below using npm run app:set'.yellow);

      const appModuleNames = getAppModuleNames();
      log(appModuleNames.join(' ').yellow);
      return resolve();
    });
  return {
    modeNow,
  };
};
