import { ActionIcon, Menu } from '@mantine/core';
import { useActiveTabsStore } from '@src/state/active-tabs';
import { createTabs, deleteGroup } from '@src/state/collections';
import { IconDotsVertical } from '@tabler/icons-react';

type GroupMenuProps = {
  activeCollectionId: string;
  groupId: string;
};

const GroupMenu = ({ activeCollectionId, groupId }: GroupMenuProps) => {
  const { activeWindow, activeTab } = useActiveTabsStore(({ activeWindow, activeTab }) => ({
    activeWindow,
    activeTab,
  }));

  // Menu handlers
  const handleAddCurrentTab = () => {
    if (activeTab) {
      createTabs({ groupId, collectionId: activeCollectionId, tabs: [activeTab] });
    }
  };

  const handleAddCurrentWindow = () => {
    if (activeWindow) {
      createTabs({ groupId, collectionId: activeCollectionId, tabs: activeWindow });
    }
  };

  const handleReplaceCurrentWindow = () => {
    console.log('test');
  };

  const handleDeleteClick = () => {
    deleteGroup({ groupId, collectionId: activeCollectionId });
  };
  return (
    <Menu position="bottom-end" shadow="md" classNames={{ dropdown: '!bg-stone-800 !border-stone-700' }}>
      <Menu.Target>
        <ActionIcon size="md" variant="outline" color="gray" styles={{ root: { borderColor: '#44403c' } }}>
          <IconDotsVertical size="1.25rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="#d4d4d4" onClick={handleAddCurrentTab}>
          Add Current Tab
        </Menu.Item>
        <Menu.Item color="#d4d4d4" onClick={handleAddCurrentWindow}>
          Add Current Window
        </Menu.Item>
        <Menu.Item color="#d4d4d4" onClick={handleReplaceCurrentWindow}>
          Replace with Window
        </Menu.Item>

        <Menu.Item color="#d4d4d4">Edit Group</Menu.Item>
        {/* TODO: link to options page for more group options/editing (add below functionality) */}
        <Menu.Item color="#d4d4d4">More Options &gt;</Menu.Item>
        {/* TODO: add toggle input here */}
        {/* <Menu.Item color="#d4d4d4">Temporary</Menu.Item> */}
        <Menu.Item color="red" onClick={handleDeleteClick}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default GroupMenu;
