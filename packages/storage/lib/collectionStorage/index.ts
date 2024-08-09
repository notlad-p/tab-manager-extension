import { createStorage, StorageType } from '../base';

import { createCollection, updateCollection, deleteCollection, setActiveCollection } from './collections';
import { createGroup, updateGroup, deleteGroup } from './groups';
import { createTabs, deleteTab } from './tabs';

import type { Collections, CollectionsStorage } from './types';

const defaultValues: Collections = {
  activeCollectionId: 1,
  highestCollectionId: 1,
  highestGroupId: 1,
  highestTabId: 1,
  collections: [
    {
      id: 1,
      name: 'Inbox',
      color: '#3b82f6',
      groups: [
        {
          id: 1,
          name: 'Unsorted',
          isOpen: true,
          tabs: [],
        },
      ],
    },
  ],
};

export const storage = createStorage<Collections>('collections-storage-key', defaultValues, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const collectionsStorage: CollectionsStorage = {
  ...storage,

  // Collections Methods
  createCollection,
  updateCollection,
  deleteCollection,
  setActiveCollection,

  // Group Methods
  createGroup,
  updateGroup,
  deleteGroup,

  // Tab Methods
  createTabs,
  deleteTab,
};
