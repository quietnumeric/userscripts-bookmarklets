module.exports = (commons) => (...doingAppNames) => {
  const {
    log,
    logln,
    abort,
    getAppModuleNames,
    literals,
    getAppNamesStored,
    storeAppNames,
  } = commons;

  const addSetAppNames = () => {
    const core = (doingText) => (storeFunc) => {
      if (doingAppNames.length === 0) abort('specify app names.');

      log(`${doingText} app names -> `.cyan);
      doingAppNames.forEach((doingAppName) => log(doingAppName.green));
      logln();
      log('existing app names -> '.cyan);
      const appModuleNames = getAppModuleNames();
      appModuleNames.forEach((appModuleName) => log(appModuleName));

      logln();
      const invalids = doingAppNames.filter(
        (doingAppName) => !appModuleNames.includes(doingAppName),
      );
      if (invalids.length > 0) abort('invalid app names -> ', ...invalids);

      const storedAppNames = storeFunc();

      log(literals.specifiedAppNames.cyan);
      storedAppNames.forEach((appName) => log(appName.green));
      logln();
      log(`done ${doingText} app names.`.green);
    };

    return {
      add: core('adding'),
      set: core('setting'),
    };
  };

  const modeAdd = () => {
    addSetAppNames().add(() => {
      const appNames = getAppNamesStored();
      doingAppNames
        .filter((adding) => !appNames.includes(adding))
        .forEach((adding) => appNames.push(adding));
      storeAppNames(appNames);
      return appNames;
    });
  };

  const modeSet = () => {
    addSetAppNames().set(() => {
      storeAppNames(doingAppNames);
      return doingAppNames;
    });
  };

  return {
    modeAdd,
    modeSet,
  };
};
