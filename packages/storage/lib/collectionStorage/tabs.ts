import { updateGroup } from './groups';

import type { deleteTabParams, createTabsParams } from './types';
// (tabIndex: number, groupId: Group['id']) => Promise<void>;

// createTabs
export const createTabs = ({ collectionId, groupId, tabs }: createTabsParams) => {
  // put tab in 'Inbox/Unsorted' group
  if (!groupId) {
    groupId = 1;
  }

  // TODO: use highestTabId to add ids to tabs
  updateGroup({
    collectionId,
    groupId,
    callback: (group, { highestTabId }) => {
      // add ids to new tabs
      const newTabs = tabs.map((tab, i) => ({ ...tab, id: highestTabId + i + 1 }));

      return { ...group, tabs: [...group.tabs, ...newTabs] };
    },
    storageCallback: ({ highestTabId }) => ({ highestTabId: highestTabId + tabs.length }),
  });
};

// updateTab

// type updateTabParams = {
//   collectionId: number;
//   groupId: number;
//   tabId: number;
//   callback: (group: Tab) => Tab;
// };
//
// const updateTab = ({ collectionId, groupId, tabId, callback }: updateTabParams) => {
//   updateGroup({
//     collectionId,
//     groupId,
//     callback: group => {
//       const tabs = group.tabs.map(tab => {
//         if (tab.id === tabId) {
//           return callback(tab);
//         }
//
//         return tab;
//       });
//
//       return { ...group, tabs };
//     },
//   });
// };

// deleteTab
export const deleteTab = ({ collectionId, groupId, tabId }: deleteTabParams) => {
  updateGroup({
    collectionId,
    groupId,
    callback: group => {
      const filteredTabs = group.tabs.filter(tab => tab.id !== tabId);

      return { ...group, tabs: filteredTabs };
    },
  });
};
