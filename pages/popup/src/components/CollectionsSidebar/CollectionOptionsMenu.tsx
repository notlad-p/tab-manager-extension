import { Menu } from '@mantine/core';
import { IconDotsVertical, IconExternalLink, IconPencil, IconTrash } from '@tabler/icons-react';

import { deleteCollection } from '@src/state/collections';

type CollectionOptionsMenuProps = {
  collectionId: number;
};

const CollectionOptionsMenu = ({ collectionId }: CollectionOptionsMenuProps) => {
  const handleOpenAllGroups = () => {
    console.log('open all');
  };

  const handleEditClick = () => {
    console.log('edit');
  };

  const handleDeleteClick = () => {
    deleteCollection(collectionId);
  };

  return (
    <Menu position="right-start" width={200} shadow="md" classNames={{ dropdown: '!bg-stone-800 !border-stone-700' }}>
      <Menu.Target>
        <button
          className="collection-dots-icon-container p-2 opacity-0"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <IconDotsVertical className="text-stone-400" size={16} />
        </button>
      </Menu.Target>

      <Menu.Dropdown onClick={e => e.stopPropagation()}>
        <Menu.Item
          className="!text-stone-300 !text-sm"
          leftSection={<IconExternalLink className="w-4 h-4" />}
          onClick={handleOpenAllGroups}
        >
          Open All Groups
        </Menu.Item>

        <Menu.Item
          className="!text-stone-300 !text-sm"
          leftSection={<IconPencil className="w-4 h-4" />}
          onClick={handleEditClick}
        >
          Edit Collection
        </Menu.Item>

        <Menu.Item color="red" leftSection={<IconTrash className="w-4 h-4" />} onClick={handleDeleteClick}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CollectionOptionsMenu;
