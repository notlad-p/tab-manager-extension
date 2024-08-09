import type { BaseStorage } from '../base';

export type Tab = {
  id: number;
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
  groups: Group[] | [];
};

export type Collections = {
  activeCollectionId: number;
  highestCollectionId: number;
  highestGroupId: number;
  highestTabId: number;
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
  deleteCollection: (id: number) => Promise<void>;
  setActiveCollection: (id: number) => Promise<void>;

  // Groups
  createGroup: (params: createGroupParams) => void;
  updateGroup: (params: updateGroupParams) => void;
  deleteGroup: (params: deleteGroupParams) => void;

  // Tabs
  createTabs: (params: createTabsParams) => void;
  deleteTab: (params: deleteTabParams) => void;
};
