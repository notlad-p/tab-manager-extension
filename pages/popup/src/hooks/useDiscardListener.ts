import { useEffect } from 'react';

export const useDiscardListener = () => {
  useEffect(() => {
    const discardListener = (tabId: number, info: chrome.tabs.TabChangeInfo, changedTab: chrome.tabs.Tab) => {
      // TODO: only run this if the tab ID is in global state: `loadingGroupTabs`

      // if tab has a url, favIconUrl, and title: discard it
      // this speeds up the process of opening a bunch of tabs
      if (changedTab.url && changedTab.favIconUrl && changedTab.title) {
        chrome.tabs.discard(tabId);
      }
      // tabIds = tabIds.filter(val => val !== tabId);
    };

    chrome.tabs.onUpdated.addListener(discardListener);

    return () => {
      chrome.tabs.onUpdated.removeListener(discardListener);
    };
  }, []);
};
