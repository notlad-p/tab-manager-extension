import { createStorage, StorageType } from './base';
import type { BaseStorage, SessionAccessLevel } from './base';
import { exampleThemeStorage } from './exampleThemeStorage';

import { collectionsStorage } from './collectionStorage';
import type { Tab, Group, GroupCollection, Collections } from './collectionStorage/types';

export { exampleThemeStorage, createStorage, collectionsStorage };
export type { StorageType, SessionAccessLevel, BaseStorage, Tab, Group, GroupCollection, Collections };
