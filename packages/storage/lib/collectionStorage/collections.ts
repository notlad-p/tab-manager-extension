import { storage } from './';

import type { createCollectionParams, updateCollectionParams } from './types';

export const createCollection = async ({ name = '', color = 'blue' }: createCollectionParams) => {
  await storage.set(collectionStorage => {
    const highestId = collectionStorage.highestId + 1;

    if (!name || name === '') {
      name = 'Collection ' + highestId;
    }

    const collection = {
      id: highestId,
      name,
      color,
      highestId: 1,
      groups: [],
    };

    const newCollections = [...collectionStorage.collections, collection];

    return { ...collectionStorage, highestId, collections: newCollections };
  });
};

export const updateCollection = async ({ collectionId, callback }: updateCollectionParams) => {
  await storage.set(collectionsStorage => {
    const collections = collectionsStorage.collections.map(collection => {
      if (collection.id === collectionId) {
        return callback(collection);
      }

      return collection;
    });

    return { ...collectionsStorage, collections };
  });
};

export const setActiveCollection = async (id: number) => {
  await storage.set(collectionsStorage => {
    return { ...collectionsStorage, activeCollectionId: id };
  });
};

export const deleteCollection = async (id: number) => {
  await storage.set(collectionsStorage => {
    let activeId = collectionsStorage.activeCollectionId;

    // if collection to delete is active
    if (id === collectionsStorage.activeCollectionId) {
      // set active collection to previous collection
      const currentIndex = collectionsStorage.collections.findIndex(coll => coll.id === id);
      const newActiveCollectionId = collectionsStorage.collections[currentIndex - 1].id;

      activeId = newActiveCollectionId;
    }

    const filteredCollections = collectionsStorage.collections.filter(collection => collection.id !== id);

    return { ...collectionsStorage, collections: filteredCollections, activeCollectionId: activeId };
  });
};
