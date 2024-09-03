import 'webextension-polyfill';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

let loadingTabs: number[] = [];

type MessageType = {
  action: 'loadingTabs';
  data: number;
};

chrome.runtime.onMessage.addListener((message: MessageType, _sender, _sendResponse) => {
  const { action, data } = message;

  if (action === 'loadingTabs') {
    console.log('pushing to loading tabs');
    loadingTabs.push(data);
  }
});

const discardListener = (tabId: number, info: chrome.tabs.TabChangeInfo, changedTab: chrome.tabs.Tab) => {
  // only run this if the tab ID is in global state: `loadingTabs`
  const tabInOpenTabs = loadingTabs.includes(tabId);

  // if tab has a url, favIconUrl, and title: discard it
  // this speeds up the process of opening a bunch of tabs
  if (tabInOpenTabs && changedTab.url && changedTab.favIconUrl && changedTab.title) {
    chrome.tabs.discard(tabId);

    // remove tab from loading tabs array
    loadingTabs = loadingTabs.filter(val => val !== tabId);
  }
};

chrome.tabs.onUpdated.addListener(discardListener);
