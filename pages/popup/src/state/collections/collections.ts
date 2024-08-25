import { useCollectionsStore } from '.';
import type { updateCollectionParams } from '@chrome-extension-boilerplate/storage/lib/collectionStorage/types';

export const createCollection = ({ name, color }: { name?: string; color?: string }) =>
  useCollectionsStore.setState(state => {
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
  });

export const updateCollection = ({ collectionId, callback, storageCallback }: updateCollectionParams) =>
  useCollectionsStore.setState(state => {
    const collections = state.collections.map(collection => {
      if (collection.id === collectionId) {
        const { highestCollectionId, highestGroupId, highestTabId, activeCollectionId } = state;
        const collectionsData = {
          highestCollectionId,
          highestGroupId,
          highestTabId,
          activeCollectionId,
        };

        return callback(collection, collectionsData);
      }

      return collection;
    });

    if (storageCallback) {
      return { ...state, ...storageCallback(state), collections };
    }

    return { ...state, collections };
  });

export const setActiveCollection = (id: number) =>
  useCollectionsStore.setState(state => {
    return { ...state, activeCollectionId: id };
  });

export const deleteCollection = (id: number) =>
  useCollectionsStore.setState(state => {
    let activeId = state.activeCollectionId;

    // if collection to delete is active
    if (id === state.activeCollectionId) {
      // set active collection to previous collection
      const currentIndex = state.collections.findIndex(coll => coll.id === id);
      const newActiveCollectionId = state.collections[currentIndex - 1].id;

      activeId = newActiveCollectionId;
    }

    const filteredCollections = state.collections.filter(collection => collection.id !== id);

    return { ...state, collections: filteredCollections, activeCollectionId: activeId };
  });
