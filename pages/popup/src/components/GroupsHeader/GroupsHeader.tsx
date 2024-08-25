import { Popover, Button, TextInput, Checkbox } from '@mantine/core';
import { useState, FormEvent } from 'react';
import type { Tab } from '@chrome-extension-boilerplate/storage';
import { IconPlus } from '@tabler/icons-react';
import { createGroup, useCollectionsStore } from '@src/state/collections';

type GroupsHeaderProps = {
  activeWindow: Tab[] | null;
};

export const GroupsHeader = ({ activeWindow }: GroupsHeaderProps) => {
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [addCurrentWindow, setAddCurrentWindow] = useState(false);

  const activeCollectionId = useCollectionsStore(state => state.activeCollectionId);
  const activeCollection = useCollectionsStore(state =>
    state.collections.find(col => col.id === state.activeCollectionId),
  );
  const numTabs = activeCollection?.groups.reduce((acc, cur) => acc + cur.tabs.length, 0);

  const handleCreateNewGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewGroupOpen(false);

    if (activeWindow) {
      createGroup({
        collectionId: activeCollectionId,
        name: groupName,
        tabs: addCurrentWindow ? activeWindow : [],
      });
    }
  };

  return (
    <div>
      <div className="pt-4 flex items-center">
        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: activeCollection?.color }} />
        <h1 className="text-xl font-extrabold">{activeCollection?.name}</h1>
      </div>

      <div className="pt-2 pb-2 border-b border-stone-700 flex justify-between items-end">
        <p className="text-stone-400">
          {activeCollection?.groups.length} Group
          {activeCollection?.groups && activeCollection?.groups.length > 1 && 's'} - {numTabs} Tab
          {numTabs && numTabs > 1 && 's'}
        </p>

        <Popover
          width={244}
          opened={newGroupOpen}
          onChange={setNewGroupOpen}
          onClose={() => setGroupName('')}
          trapFocus
          position="bottom-end"
          shadow="md"
        >
          <Popover.Target>
            <Button size="xs" rightSection={<IconPlus size={12} />} onClick={() => setNewGroupOpen(o => !o)}>
              New Group
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <form className="flex flex-col gap-2" onSubmit={handleCreateNewGroup}>
              <TextInput
                label="Name"
                value={groupName}
                onChange={event => setGroupName(event.currentTarget.value)}
                placeholder="Group Name"
                size="xs"
              />
              <Checkbox
                label="Add tabs in current window"
                size="xs"
                checked={addCurrentWindow}
                onChange={event => setAddCurrentWindow(event.currentTarget.checked)}
              />
              <div className="flex items-end justify-end">
                <Button type="submit" size="xs">
                  Create
                </Button>
              </div>
            </form>
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  );
};
