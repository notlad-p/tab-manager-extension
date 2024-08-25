import { Accordion } from '@mantine/core';

import { AccordionControl } from './AccordionControl';
import { AccordionPanel } from './AccordionPanel';

import type { Tab } from '@chrome-extension-boilerplate/storage';
import { updateGroup, useCollectionsStore } from '@src/state/collections';

import './tab-groups-accordion.css';

type TabGroupsAccordionProps = {
  activeTab: Tab;
  activeWindow: Tab[];
};

export const TabGroupsAccordion = ({ activeTab, activeWindow }: TabGroupsAccordionProps) => {
  const collections = useCollectionsStore(state => state);
  const activeCollection = collections.collections.find(col => col.id === collections.activeCollectionId);

  const handleControlClick = (groupId: number) => {
    updateGroup({
      collectionId: collections.activeCollectionId,
      groupId,
      callback: group => {
        return { ...group, isOpen: !group.isOpen };
      },
    });
  };

  return (
    <Accordion
      multiple
      chevronPosition="left"
      order={3}
      className="pt-3"
      classNames={{
        root: 'w-full',
        item: '!border-none',
        control: '!bg-transparent',
        label: '!font-semibold',
        panel: 'border border-stone-700 bg-stone-800 rounded',
        content: '!py-3 !pr-2 !pl-0',
      }}
      defaultValue={activeCollection?.groups
        .map(group => (group.isOpen ? `${activeCollection.id.toString()}-${group.id.toString()}` : ''))
        .filter(group => group !== '')}
    >
      {/* TODO: Droppable here (surrounding Accordion) */}
      <div>
        {activeCollection?.groups.map(group => (
          <Accordion.Item
            key={`${activeCollection.id.toString()}-${group.id.toString()}`}
            value={`${activeCollection.id.toString()}-${group.id.toString()}`}
          >
            {/* TODO: Draggable here (surrounding Accordion.Item above) */}

            {/* TODO: Droppable here (surrounding AccordionControl) */}
            <AccordionControl
              activeWindow={activeWindow}
              groupId={group.id}
              activeTab={activeTab}
              groupTabs={group.tabs}
              onClick={() => handleControlClick(group.id)}
            >
              {group.name}
            </AccordionControl>

            <AccordionPanel collectionId={activeCollection.id} group={group} />
          </Accordion.Item>
        ))}
      </div>
    </Accordion>
  );
};
