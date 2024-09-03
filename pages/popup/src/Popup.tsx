import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { MantineProvider, Popover, createTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useCollectionsStore } from './state/collections';

import { CollectionsSidebar, GroupsHeader, TabGroupsAccordion } from './components';

import '@mantine/core/styles.css';

// NOTE: hmr package isn't in package.json?
// devDependencies:
// "@chrome-extension-boilerplate/hmr": "workspace:*"

const theme = createTheme({
  colors: {
    dark: [
      '#f5f5f4',
      '#e7e5e4',
      '#d6d3d1',
      '#a8a29e',
      '#78716c',
      '#57534e',
      '#44403c',
      '#292524', // background
      '#1c1917',
      '#0c0a09',
    ],
  },
  components: {
    Popover: Popover.extend({
      classNames: {
        dropdown: '!bg-stone-800 !border-stone-700',
      },
    }),
  },
});

const Popup = () => {
  const [active, setActive] = useState({ title: '', url: '', favIconUrl: '' });
  const [activeWindow, setActiveWindow] = useState<
    { title: string | undefined; url: string | undefined; favIconUrl: string | undefined }[] | null
  >(null);

  const activeCollection = useCollectionsStore(state =>
    state?.collections?.find(col => col.id === state.activeCollectionId),
  );

  useEffect(() => {
    // get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const { title, url, favIconUrl } = tabs[0];

      if (title && url && favIconUrl) setActive({ title, url, favIconUrl });
    });

    // get current window tabs
    chrome.tabs.query({ currentWindow: true }, tabs => {
      const activeWin = tabs.map(({ title, url, favIconUrl }) => ({ title, url, favIconUrl }));
      if (activeWin.length > 0) {
        setActiveWindow(activeWin);
        // TODO: how to get info from discarded tabs? manually set url, favicon, title when discarding?
        // console.log(activeWin);
      }
    });
  }, []);

  // <img src={chrome.runtime.getURL('popup/logo.svg')} className="App-logo" alt="logo" />
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <div className="absolute top-0 left-0 bottom-0 right-0 overflow-y-auto">
        <div className="text-sm min-h-[calc(100%-24px)] m-3 flex">
          <CollectionsSidebar />
          <div className="w-[70%] pl-3">
            {activeCollection && (
              <>
                <GroupsHeader activeWindow={activeWindow} />
                {/* Tab Groups */}
                <TabGroupsAccordion activeTab={active} activeWindow={activeWindow} />
              </>
            )}
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
