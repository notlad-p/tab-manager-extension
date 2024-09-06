import { v4 as uuidv4 } from 'uuid';

import { useCollectionsStore } from '.';
import type { updateCollectionParams } from '@chrome-extension-boilerplate/storage/lib/collectionStorage/types';

export const createCollection = ({ name, color }: { name?: string; color?: string }) =>
  useCollectionsStore.setState(state => {
    if (!state.collections) {
      return state;
    }

    if (!name) {
      name = 'Collection ' + state.collections?.length;
    }

    if (!color) {
      color = '#3b82f6';
    }

    const collection = {
      id: uuidv4(),
      name,
      color,
      highestId: 1,
      groups: [],
    };

    const newCollections = [...state.collections, collection];

    return { ...state, collections: newCollections };
  });

export const updateCollection = ({ collectionId, callback }: updateCollectionParams) =>
  useCollectionsStore.setState(state => {
    if (state.collections === null) {
      return state;
    }

    const collections = state.collections.map(collection => {
      if (collection.id === collectionId) {
        return callback(collection);
      }

      return collection;
    });

    return { ...state, collections };
  });

export const setActiveCollection = (id: string) =>
  useCollectionsStore.setState(state => {
    return { ...state, activeCollectionId: id };
  });

export const deleteCollection = (id: string) =>
  useCollectionsStore.setState(state => {
    if (state.collections === null) {
      return state;
    }

    let activeId = state.activeCollectionId;

    // if collection to delete is active
    if (id === state.activeCollectionId) {
      // set active collection to previous or next collection
      const currentIndex = state.collections.findIndex(coll => coll.id === id);
      if (currentIndex === 0) {
        activeId = state.collections[currentIndex + 1].id;
      } else {
        activeId = state.collections[currentIndex - 1].id;
      }
    }

    const filteredCollections = state.collections.filter(collection => collection.id !== id);

    return { ...state, collections: filteredCollections, activeCollectionId: activeId };
  });
