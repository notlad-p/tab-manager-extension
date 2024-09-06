import { v4 as uuidv4 } from 'uuid';

import { updateCollection } from './collections';

import type {
  createGroupParams,
  updateGroupParams,
  deleteGroupParams,
  Tab,
} from '@chrome-extension-boilerplate/storage/lib/collectionStorage/types';

// createGroup
export const createGroup = ({ collectionId, name = '', tabs = [] }: createGroupParams) =>
  updateCollection({
    collectionId,
    callback: collection => {
      const groupName = name || `Group ${collection.groups.length}`;

      const tabsWithIds: Tab[] | [] = tabs.map(tab => {
        return { ...tab, id: uuidv4() };
      });

      const newGroup = {
        id: uuidv4(),
        name: groupName,
        isOpen: false,
        tabs: tabsWithIds,
      };

      return { ...collection, groups: [...collection.groups, newGroup] };
    },
  });

// updateGroup
export const updateGroup = ({ collectionId, groupId, callback }: updateGroupParams) =>
  updateCollection({
    collectionId,
    callback: collection => {
      const groups = collection.groups.map(group => {
        if (group.id === groupId) {
          return callback(group);
        }

        return group;
      });

      return { ...collection, groups };
    },
  });

// deleteGroup
export const deleteGroup = ({ collectionId, groupId }: deleteGroupParams) =>
  updateCollection({
    collectionId,
    callback: collection => {
      const newFilteredGroups = collection.groups.filter(group => group.id !== groupId);

      return { ...collection, groups: newFilteredGroups };
    },
  });
