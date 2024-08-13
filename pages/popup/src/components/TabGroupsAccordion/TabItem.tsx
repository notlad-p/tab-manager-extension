import React from 'react';
import { IconX } from '@tabler/icons-react';

import { Link } from '../Link/Link';

import { collectionsStorage, type Tab } from '@chrome-extension-boilerplate/storage';
import { useStorageSuspense } from '@chrome-extension-boilerplate/shared';

type TabProps = {
  tab: Tab;
  groupId?: number;
  tabIndex?: number;
};

const TabItem: React.FC<TabProps> = ({ tab, groupId, tabIndex }: TabProps) => {
  const { url, favIconUrl, title } = tab;
  const collections = useStorageSuspense(collectionsStorage);

  const handleRemoveTab = (groupId: number) => {
    // TODO: use tab id instead of index
    if (tabIndex) {
      collectionsStorage.deleteTab({ collectionId: collections.activeCollectionId, groupId, tabIndex });
    }
  };

  return (
    <Link href={url}>
      <div className="tab-list-item flex gap-2 py-0.5 items-center hover:underline cursor-pointer">
        <button
          className="tab-x-icon-container p-2 pr-0 opacity-0"
          onClick={e => {
            e.stopPropagation();
            if (groupId) handleRemoveTab(groupId);
          }}
        >
          <IconX className="text-stone-400" size={16} />
        </button>
        <img src={favIconUrl} alt={title[0]} className="w-4" />
        <p className="text-stone-200 text-nowrap overflow-hidden overflow-ellipsis">{title}</p>
      </div>
    </Link>
  );
};

export default TabItem;
