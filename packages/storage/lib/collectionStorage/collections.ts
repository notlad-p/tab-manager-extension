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

// TODO: deleteCollection
