// Extension installation handler
browser.runtime.onInstalled.addListener(() => {
  console.log('PseudoRun extension installed');
});

// Browser action click handler
browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.create({
    url: browser.runtime.getURL('index.html')
  });
});