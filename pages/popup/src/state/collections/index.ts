import { create, type Mutate, StoreApi } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { collectionsStorage, type Collections } from '@chrome-extension-boilerplate/storage';

const storage: PersistStorage<Collections> = {
  getItem: async () => {
    return { state: await collectionsStorage.get() };
  },
  setItem: async (_name, value) => {
    await collectionsStorage.set(value.state);
  },
  removeItem: () => null,
};

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

type CollectionsStore = Collections & {
  createCollection: (options: { name?: string; color?: string }) => void;
};

// TODO: copy methods over to this store
// - First test by adding collection & see if storage changes - IT DOES!!!
//
// TODO: now:
// - copy over all methods from storage
// - use those methods in components
// - implement storage update event listeners (when storage updates, so does global zustand state)
//  - USE `subscribe` METHOD already in storage?
//  - Only change if zustand store != storage and maybe try to detect that change didn't come from zustand action
// - implement drag and drop with zustand state
export const useCollectionsStore = create<CollectionsStore>()(
  persist(
    set => ({
      ...defaultValues,
      createCollection: ({ name, color }) =>
        set(state => {
          const highestCollectionIdId = state.highestCollectionId + 1;

          if (!name) {
            name = 'Collection ' + highestCollectionIdId;
          }

          if (!color) {
            color = '#3b82f6';
          }

          const collection = {
            id: highestCollectionIdId,
            name,
            color,
            highestId: 1,
            groups: [],
          };

          const newCollections = [...state.collections, collection];

          return { ...state, highestCollectionId: highestCollectionIdId, collections: newCollections };
        }),
    }),
    {
      name: 'collections-storage',
      storage,
    },
  ),
);

import { createCollection, updateCollection, setActiveCollection, deleteCollection } from './collections';
export { createCollection, updateCollection, setActiveCollection, deleteCollection };

import { createGroup, updateGroup, deleteGroup } from './groups';
export { createGroup, updateGroup, deleteGroup };

import { createTabs, deleteTab } from './tabs';
export { createTabs, deleteTab };

// type StoreWithPersist = Mutate<StoreApi<Collections>, [["zustand/persist", unknown]]>
//
// export const withStorageDOMEvents = (store: StoreWithPersist) => {
//   const storageEventCallback = (e: StorageEvent) => {
//     if (e.key === store.persist.getOptions().name && e.newValue) {
//       store.persist.rehydrate()
//     }
//   }
//
//   window.addEventListener('storage', storageEventCallback)
//
//   return () => {
//     window.removeEventListener('storage', storageEventCallback)
//   }
// }
