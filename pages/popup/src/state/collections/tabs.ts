import { v4 as uuidv4 } from 'uuid';
import { updateGroup } from './groups';

import type {
  createTabsParams,
  deleteTabParams,
} from '@chrome-extension-boilerplate/storage/lib/collectionStorage/types';

// createTabs
export const createTabs = ({ collectionId, groupId, tabs }: createTabsParams) => {
  updateGroup({
    collectionId,
    groupId,
    callback: group => {
      // add ids to new tabs
      const newTabs = tabs.map(tab => ({ ...tab, id: uuidv4() }));

      return { ...group, tabs: [...group.tabs, ...newTabs] };
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
export const deleteTab = ({ collectionId, groupId, tabId }: deleteTabParams) =>
  updateGroup({
    collectionId,
    groupId,
    callback: group => {
      const filteredTabs = group.tabs.filter(tab => tab.id !== tabId);

      return { ...group, tabs: filteredTabs };
    },
  });
