import { updateCollection } from './collections';

import type { createGroupParams, deleteGroupParams, updateGroupParams } from './types';

// createGroup
export const createGroup = ({ collectionId, name = '', tabs = [] }: createGroupParams) => {
  updateCollection({
    collectionId,
    callback: collection => {
      const newHighestId = collection.highestId + 1;
      const groupName = name || `Group ${newHighestId}`;

      const newGroup = {
        id: newHighestId,
        name: groupName,
        isOpen: false,
        tabs,
      };

      return { ...collection, highestId: newHighestId, groups: [...collection.groups, newGroup] };
    },
  });
};

// updateGroup
export const updateGroup = ({ collectionId, groupId, callback }: updateGroupParams) => {
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
};

// deleteGroup
export const deleteGroup = ({ collectionId, groupId }: deleteGroupParams) => {
  updateCollection({
    collectionId,
    callback: collection => {
      const newFilteredGroups = collection.groups.filter(group => group.id !== groupId);

      return { ...collection, groups: newFilteredGroups };
    },
  });
};
