import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { collectionsStorage } from '@chrome-extension-boilerplate/storage';
import type { Collections, GroupCollection } from '@chrome-extension-boilerplate/storage';

const storage: PersistStorage<Collections> = {
  getItem: async () => {
    return { state: await collectionsStorage.get() };
  },
  setItem: async (_name, value) => {
    await collectionsStorage.set(value.state);
  },
  removeItem: () => null,
};

type CollectionsState = {
  activeCollectionId: string | null;
  collections: GroupCollection[] | null;
};

const defaultValues: CollectionsState = {
  activeCollectionId: null,
  collections: null,
};

// TODO: now:
// - implement storage update event listeners (when storage updates, so does global zustand state)
//  - USE `subscribe` METHOD already in storage?
//  - Only change if zustand store != storage and maybe try to detect that change didn't come from zustand action
export const useCollectionsStore = create<CollectionsState>()(
  persist(
    () => ({
      ...defaultValues,
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
