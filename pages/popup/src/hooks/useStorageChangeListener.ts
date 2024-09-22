import { useEffect } from 'react';

export const useStorageChangeListener = () => {
  useEffect(() => {
    const storageChangeListener = (changes, namespace) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`,
        );

        console.log('OLD value: ', oldValue);
        console.log('NEW value: ', newValue);
      }
    };
    chrome.storage.onChanged.addListener(storageChangeListener);

    return () => {
      chrome.storage.onChanged.removeListener(storageChangeListener);
    };
  }, []);
};
