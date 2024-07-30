import type { BaseStorage } from '../base';

export type Tab = {
  title: string;
  url: string;
  favIconUrl: string;
};

export type Group = {
  id: number;
  name: string;
  isOpen: boolean;
  tabs: Tab[];
};

export type GroupCollection = {
  id: number;
  name: string;
  color: string;
  highestId: number;
  groups: Group[] | [];
};

export type Collections = {
  activeCollectionId: number;
  highestId: number;
  collections: GroupCollection[];
};

// method types
export type createCollectionParams = Pick<GroupCollection, 'name' | 'color'>;
export type updateCollectionParams = {
  callback: (collection: GroupCollection) => GroupCollection;
  collectionId: number;
};

export type createGroupParams = {
  collectionId: number;
  name?: string;
  tabs: Tab[] | [];
};
export type updateGroupParams = {
  callback: (group: Group) => Group;
  collectionId: number;
  groupId: number;
};
export type deleteGroupParams = {
  collectionId: number;
  groupId: number;
};

export type createTabsParams = {
  collectionId: number;
  groupId: number;
  tabs: Tab[];
};
export type deleteTabParams = {
  collectionId: number;
  groupId: number;
  tabIndex: number;
};

export type CollectionsStorage = BaseStorage<Collections> & {
  // Collections
  createCollection: (params: createCollectionParams) => Promise<void>;
  updateCollection: (params: updateCollectionParams) => Promise<void>;

  // Groups
  createGroup: (params: createGroupParams) => void;
  updateGroup: (params: updateGroupParams) => void;
  deleteGroup: (params: deleteGroupParams) => void;

  // Tabs
  createTabs: (params: createTabsParams) => void;
  deleteTab: (params: deleteTabParams) => void;
};
