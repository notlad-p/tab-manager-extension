import type { Group, GroupCollection } from '@chrome-extension-boilerplate/storage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accordion, Button } from '@mantine/core';
import { useCollectionsStore, updateGroup } from '@src/state/collections';
import GroupMenu from './GroupMenu';
import { IconExternalLink } from '@tabler/icons-react';

type GroupContainerProps = {
  group: Group;
  children: React.ReactNode;
};

const GroupContainer = ({ group, children }: GroupContainerProps) => {
  // const collections = useCollectionsStore(state => state);
  const activeCollection = useCollectionsStore(state =>
    state.collections?.find(col => col.id === state.activeCollectionId),
  ) as GroupCollection;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
    data: { type: 'group' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Open accordion handler
  const handleControlClick = (groupId: string) => {
    updateGroup({
      collectionId: activeCollection.id,
      groupId,
      callback: group => {
        return { ...group, isOpen: !group.isOpen };
      },
    });
  };

  // Open tabs handler
  const handleOpenGroup = () => {
    for (let i = group.tabs.length - 1; i >= 0; i--) {
      // create the tab
      chrome.tabs.create({ url: group.tabs[i].url, active: false }, tab => {
        // TODO: discard based on user setting in options page,
        // if number of tabs being opened is greater than x, then discard them
        chrome.runtime.sendMessage({ action: 'loadAndDiscardTab', data: tab.id });
        console.log(tab.id);
      });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? 'opacity-50' : 'opacity-100'} bg-stone-900 rounded`}>
      <Accordion.Item value={`${activeCollection.id}-${group.id}`}>
        {/* Accordion Control */}
        <div className="flex items-center gap-2 pr-2" {...listeners} {...attributes}>
          <Accordion.Control
            onClick={() => handleControlClick(group.id)}
            classNames={{ itemTitle: 'flex-grow text-nowrap overflow-hidden overflow-ellipsis' }}
          >
            {group.name}
          </Accordion.Control>
          <Button
            size="xs"
            variant="light"
            className="min-w-20"
            leftSection={<IconExternalLink size={14} />}
            onClick={handleOpenGroup}
          >
            Open
          </Button>

          <GroupMenu activeCollectionId={activeCollection.id} groupId={group.id} />
        </div>

        {/* Accordion Panel */}
        <Accordion.Panel>
          <ul className="w-full flex flex-col">
            {group.tabs.length === 0 && <p className="text-stone-400 py-0.5">No tabs in this group...</p>}
            {/* Tabs list items */}
            {children}
          </ul>
        </Accordion.Panel>
      </Accordion.Item>
    </div>
  );
};

export default GroupContainer;
