import { Accordion, AccordionControlProps, ActionIcon, Button, Menu } from '@mantine/core';
import { IconDotsVertical, IconExternalLink } from '@tabler/icons-react';

import type { Tab } from '@chrome-extension-boilerplate/storage';
import { createTabs, deleteGroup, useCollectionsStore } from '@src/state/collections';

type CustomAccordionControlProps = AccordionControlProps & {
  groupId: number;
  activeTab: Tab;
  activeWindow: Tab[];
  groupTabs: Tab[];
};

export const AccordionControl = ({
  groupId,
  activeTab,
  activeWindow,
  groupTabs,
  ...props
}: CustomAccordionControlProps) => {
  const activeCollectionId = useCollectionsStore(state => state.activeCollectionId);

  // Open handler
  const handleOpenGroup = () => {
    for (let i = groupTabs.length - 1; i >= 0; i--) {
      // open list of tabs
      chrome.tabs.create({ url: groupTabs[i].url, active: false });
    }
  };

  // Menu handlers
  const handleAddCurrentTab = () => {
    if (activeCollectionId) {
      createTabs({ groupId, collectionId: activeCollectionId, tabs: [activeTab] });
    }
  };

  const handleAddCurrentWindow = () => {
    if (activeCollectionId) {
      createTabs({ groupId, collectionId: activeCollectionId, tabs: activeWindow });
    }
  };

  const handleReplaceCurrentWindow = () => {
    console.log('test');
  };

  const handleDeleteClick = () => {
    if (activeCollectionId) {
      deleteGroup({ groupId, collectionId: activeCollectionId });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Accordion.Control
        {...props}
        classNames={{ itemTitle: 'flex-grow text-nowrap overflow-hidden overflow-ellipsis' }}
      />
      <Button
        size="xs"
        variant="light"
        className="min-w-20"
        leftSection={<IconExternalLink size={14} />}
        onClick={handleOpenGroup}
      >
        Open
      </Button>
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
    </div>
  );
};
