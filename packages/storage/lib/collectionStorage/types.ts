import type { BaseStorage } from '../base';

export type Tab = {
  id: string;
  title: string;
  url: string;
  favIconUrl: string;
};

export type Group = {
  id: string;
  name: string;
  isOpen: boolean;
  tabs: Tab[];
};

export type GroupCollection = {
  id: string;
  name: string;
  color: string;
  groups: Group[] | [];
};

export type Collections = {
  activeCollectionId: string;
  collections: GroupCollection[];
};

// method types
export type createCollectionParams = Pick<GroupCollection, 'name' | 'color'>;
export type updateCollectionParams = {
  callback: (collection: GroupCollection) => GroupCollection;
  collectionId: string;
};

export type createGroupParams = {
  collectionId: string;
  name?: string;
  tabs: Tab[] | [];
};
export type updateGroupParams = {
  callback: (group: Group) => Group;
  collectionId: string;
  groupId: string;
};
export type deleteGroupParams = {
  collectionId: string;
  groupId: string;
};

export type createTabsParams = {
  collectionId: string;
  groupId: string;
  tabs: Tab[];
};
export type deleteTabParams = {
  collectionId: string;
  groupId: string;
  tabId: string;
};

export type CollectionsStorage = BaseStorage<Collections> & {
  // // Collections
  // createCollection: (params: createCollectionParams) => Promise<void>;
  // updateCollection: (params: updateCollectionParams) => Promise<void>;
  // deleteCollection: (id: string) => Promise<void>;
  // setActiveCollection: (id: string) => Promise<void>;
  //
  // // Groups
  // createGroup: (params: createGroupParams) => void;
  // updateGroup: (params: updateGroupParams) => void;
  // deleteGroup: (params: deleteGroupParams) => void;
  //
  // // Tabs
  // createTabs: (params: createTabsParams) => void;
  // deleteTab: (params: deleteTabParams) => void;
};
