import { BaseStorage, createStorage, StorageType } from './base';

type Tab = {
  title: string;
  url: string;
  favIconUrl: string;
};

type Group = {
  id: number;
  name: string;
  tabs: Tab[];
  // TODO: add `isOpen` value for accordion
};

type TabGroups = {
  highestId: number;
  groups: Group[];
};

type TabGroupsStorage = BaseStorage<TabGroups> & {
  addTab: (tab: Tab, groupId?: Group['id']) => Promise<void>;
  removeTab: (tabIndex: number, groupId: Group['id']) => Promise<void>;
  addGroup: ({ tabs, name }: { tabs?: Tab[]; name?: string }) => Promise<void>;
  removeGroup: (id: number) => Promise<void>;
  // renameGroup: () => Promise<void>;
  // reorderTabs:
};

const defaultValues = {
  highestId: 1,
  groups: [
    {
      id: 1,
      name: 'Unsorted',
      tabs: [],
    },
  ],
};

const storage = createStorage<TabGroups>('tab-groups-storage-key', defaultValues, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const tabGroupsStorage: TabGroupsStorage = {
  ...storage,
  addTab: async (newTab, groupId) => {
    if (!groupId) {
      groupId = 1;
    }

    await storage.set(tabGroups => {
      const newGroups = tabGroups.groups.map(group => {
        if (group.id === groupId) {
          group.tabs = [...group.tabs, newTab];
        }

        return group;
      });

      return { ...tabGroups, groups: newGroups };
    });
  },

  removeTab: async (tabIndex, groupId) => {
    await storage.set(tabGroups => {
      const newGroups = tabGroups.groups.map(group => {
        if (group.id === groupId) {
          // remove tab
          group.tabs.splice(tabIndex, 1);
        }

        return group;
      });

      return { ...tabGroups, groups: newGroups };
    });
  },
  // reorderTabs: async () => { }

  // TODO: implement this with input modal / popover
  addGroup: async ({ tabs = [], name = '' }) => {
    await storage.set(tabGroups => {
      const newHighestId = tabGroups.highestId + 1;

      if (!name || name === '') {
        name = 'Group ' + newHighestId;
      }

      const newGroups = [...tabGroups.groups, { id: newHighestId, name, tabs }];

      return { highestId: newHighestId, groups: newGroups };
    });
  },
  removeGroup: async id => {
    await storage.set(tabGroups => {
      const newFilteredGroups = tabGroups.groups.filter(group => group.id !== id);
      console.log('test');

      return { ...tabGroups, groups: newFilteredGroups };
    });
  },
};
