const os = {
  win: process.platform === 'win32',
  mac: process.platform === 'darwin',
  linux: process.platform === 'linux',
};
const browsers = {
  chrome: {
    runtime: os.win
      ? 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    urlToArg: (url) => url,
  },
};

module.exports = { browsers };
