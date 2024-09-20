import React, { useState } from 'react';
import { IconWorld, IconX } from '@tabler/icons-react';

import { Link } from '../Link/Link';

import type { Tab } from '@chrome-extension-boilerplate/storage';
import { deleteTab, useCollectionsStore } from '@src/state/collections';

import './tab-item.css';

type TabProps = {
  tab: Tab;
  groupId?: string;
};

const TabItem: React.FC<TabProps> = ({ tab, groupId }: TabProps) => {
  const { url, favIconUrl, title } = tab;
  const [imageErr, setImageErr] = useState(false);
  const activeCollectionId = useCollectionsStore(state => state.activeCollectionId);

  const handleRemoveTab = (groupId: string) => {
    if (tab.id && activeCollectionId) {
      deleteTab({ collectionId: activeCollectionId, groupId, tabId: tab.id });
    }
  };

  const handleImageError = () => {
    setImageErr(true);
  };

  return (
    <Link href={url}>
      <div className="tab-list-item flex gap-2 py-0.5 items-center hover:underline cursor-pointer bg-stone-800 rounded">
        {groupId && (
          <button
            className="tab-x-icon-container p-2 pr-0 opacity-0"
            onClick={e => {
              e.stopPropagation();
              if (groupId) handleRemoveTab(groupId);
            }}
          >
            <IconX className="text-stone-400" size={16} />
          </button>
        )}
        {favIconUrl && !imageErr ? (
          <img src={favIconUrl} alt="" onError={handleImageError} className="w-4" />
        ) : (
          <IconWorld size={16} className="min-w-4" />
        )}
        <p className="text-stone-200 text-nowrap overflow-hidden overflow-ellipsis">{title}</p>
      </div>
    </Link>
  );
};

export default TabItem;
