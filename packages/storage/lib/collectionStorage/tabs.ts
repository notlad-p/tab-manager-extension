import { storage } from './';
import { updateCollection } from './collections';
import { updateGroup } from './groups';

import type { deleteTabParams, createTabsParams } from './types';
// (tabIndex: number, groupId: Group['id']) => Promise<void>;

// createTabs
export const createTabs = ({ collectionId, groupId, tabs }: createTabsParams) => {
  // put tab in 'Inbox/Unsorted' group
  if (!groupId) {
    groupId = 1;
  }

  updateGroup({
    collectionId,
    groupId,
    callback: group => {
      return { ...group, tabs: [...group.tabs, ...tabs] };
    },
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
export const deleteTab = ({ collectionId, groupId, tabIndex }: deleteTabParams) => {
  updateGroup({
    collectionId,
    groupId,
    callback: group => {
      const filteredTabs = group.tabs.filter((_tab, i) => i !== tabIndex);

      return { ...group, tabs: filteredTabs };
    },
  });
};
