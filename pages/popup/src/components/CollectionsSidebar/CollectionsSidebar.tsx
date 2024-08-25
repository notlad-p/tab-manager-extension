import { TextInput, Code, UnstyledButton, Text, Group } from '@mantine/core';
import { IconSearch, IconSettings } from '@tabler/icons-react';

import AddCollectionPopover from './AddCollectionPopover';
import CollectionOptionsMenu from './CollectionOptionsMenu';
import { setActiveCollection, useCollectionsStore } from '@src/state/collections';

import './CollectionsSidebar.css';

const links = [
  {
    icon: IconSettings,
    label: 'Options',
    onClick: () => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    },
  },
];

// NOTE: inspired by: https://ui.mantine.dev/component/navbar-search/
export const CollectionsSidebar = () => {
  const collections = useCollectionsStore(state => state);

  const handleCollectionLinkClick = (id: number) => {
    if (id !== collections.activeCollectionId) {
      setActiveCollection(id);
    }
  };

  const mainLinks = links.map(link => (
    <UnstyledButton
      key={link.label}
      className="flex items-center w-full !text-xs font-medium !p-2 rounded hover:bg-stone-700 hover:bg-opacity-70"
      onClick={link?.onClick}
    >
      <div className="flex items-center flex-1">
        <link.icon size={20} className="mr-3 text-stone-300" stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {/* {link.notifications && ( */}
      {/*   <Badge size="sm" variant="filled" className={'mainLinkBadge'}> */}
      {/*     {link.notifications} */}
      {/*   </Badge> */}
      {/* )} */}
    </UnstyledButton>
  ));

  // TODO: draggable (reorder collections) & dropable (move groups to collections)
  const collectionLinks = collections.collections.map(collection => (
    <UnstyledButton
      key={collection.id}
      className={`collection-item ${collection.id === collections.activeCollectionId && '!bg-opacity-40 !bg-stone-700'} flex items-center justify-between w-full rounded !text-xs font-medium !pl-3 !py-0.5 mb-1 hover:!bg-stone-700 hover:!bg-opacity-70`}
      onClick={() => handleCollectionLinkClick(collection.id)}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 mr-4 bg-blue-500 rounded-full" style={{ backgroundColor: collection.color }} />
        <p>{collection.name}</p>
      </div>
      <CollectionOptionsMenu collectionId={collection.id} />
    </UnstyledButton>
  ));

  return (
    <nav className="bg-stone-900 w-[30%] min-h-[60%] p-4 pt-0 flex flex-col border-r border-r-stone-700">
      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={<IconSearch className="w-3 h-3" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className="font-bold !text-[10px] !bg-stone-800 border border-stone-800">Ctrl + K</Code>}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
      />

      <div className="-mx-4 mb-4 border-b border-b-stone-700">
        <div className="px-1.5 pb-4">{mainLinks}</div>
      </div>

      <div className="-mx-5 mb-4">
        <Group className="pl-[18px] pr-4 mb-1.5" justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>

          <AddCollectionPopover />
        </Group>

        {/* TODO: droppable here (reordering collections) */}
        <div className="px-2.5 pb-1.5">{collectionLinks}</div>
      </div>
    </nav>
  );
};
