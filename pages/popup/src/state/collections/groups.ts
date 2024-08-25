import { updateCollection } from './collections';

import type {
  createGroupParams,
  updateGroupParams,
  deleteGroupParams,
} from '@chrome-extension-boilerplate/storage/lib/collectionStorage/types';

// createGroup
export const createGroup = ({ collectionId, name = '', tabs = [] }: createGroupParams) =>
  updateCollection({
    collectionId,
    callback: (collection, collectionsData) => {
      const highestGroupId = collectionsData.highestGroupId + 1;
      const groupName = name || `Group ${highestGroupId}`;

      const newGroup = {
        id: highestGroupId,
        name: groupName,
        isOpen: false,
        tabs,
      };

      return { ...collection, groups: [...collection.groups, newGroup] };
    },
    storageCallback: ({ highestGroupId }) => ({ highestGroupId: highestGroupId + 1 }),
  });

// updateGroup
export const updateGroup = ({ collectionId, groupId, callback, storageCallback }: updateGroupParams) =>
  updateCollection({
    collectionId,
    callback: (collection, collectionData) => {
      const groups = collection.groups.map(group => {
        if (group.id === groupId) {
          return callback(group, collectionData);
        }

        return group;
      });

      return { ...collection, groups };
    },
    storageCallback,
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
