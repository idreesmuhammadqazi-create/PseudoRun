// Cross-browser compatibility: Use chrome API (works in both Chrome and Edge)
// Firefox also supports chrome.* APIs in Manifest V3

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('PseudoRun extension installed');
});

// Action click handler (Manifest V3)
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});