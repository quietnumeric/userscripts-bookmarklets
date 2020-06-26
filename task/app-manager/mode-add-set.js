module.exports = (commons) => (...doingAppNames) => {
  const {
    log,
    logln,
    getAppModuleNames,
    literals,
    getAppNamesStored,
    storeAppNames,
  } = commons;

  const addSetAppNames = () => {
    const core = (doingText) => (storeFunc) =>
      new Promise((resolve, reject) => {
        if (doingAppNames.length === 0)
          return reject(new Error(['specify app names.']));

        log(`${doingText} app names -> `.cyan);
        doingAppNames.forEach((doingAppName) => log(doingAppName.green));
        logln();
        log('existing app names -> '.cyan);
        const appModuleNames = getAppModuleNames();
        appModuleNames.forEach((appModuleName) => log(appModuleName));

        logln();
        const invalids = doingAppNames.filter(
          (doingAppName) => !appModuleNames.includes(doingAppName)
        );
        if (invalids.length > 0)
          return reject(
            new Error(`invalid app names -> ${invalids.join(' ')}`)
          );

        const storedAppNames = storeFunc();

        log(literals.specifiedAppNames.cyan);
        storedAppNames.forEach((appName) => log(appName.green));
        logln();
        log(`done ${doingText} app names.`.green);
        return resolve(true);
      });

    return {
      add: core('adding'),
      set: core('setting'),
    };
  };

  const modeAdd = async () => {
    const resolved = await addSetAppNames().add(() => {
      const appNames = getAppNamesStored();
      doingAppNames
        .filter((adding) => !appNames.includes(adding))
        .forEach((adding) => appNames.push(adding));
      storeAppNames(appNames);
      return appNames;
    });
    return resolved;
  };

  const modeSet = async () => {
    const resolved = await addSetAppNames().set(() => {
      storeAppNames(doingAppNames);
      return doingAppNames;
    });
    return resolved;
  };

  return {
    modeAdd,
    modeSet,
  };
};
