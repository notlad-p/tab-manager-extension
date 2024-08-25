import { Accordion } from '@mantine/core';

import { type Group } from '@chrome-extension-boilerplate/storage';
import { DndContext, closestCenter, useSensor, useSensors, KeyboardSensor, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { updateGroup } from '@src/state/collections';
import { useState } from 'react';
import { SortableItem } from './SortableItem';
import TabItem from './TabItem';

type AccordionPanelProps = {
  collectionId: number;
  group: Group;
};

export const AccordionPanel = ({ collectionId, group }: AccordionPanelProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      updateGroup({
        groupId: group.id,
        collectionId,
        callback: group => {
          const oldIndex = group.tabs.findIndex(tab => tab.id === active.id);
          const newIndex = group.tabs.findIndex(tab => tab.id === over.id);

          return { ...group, tabs: arrayMove(group.tabs, oldIndex, newIndex) };
        },
      });
    }

    setActiveId(null);
  };

  return (
    <Accordion.Panel>
      {/* TODO: Droppable here */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <ul className="w-full flex flex-col">
          {group.tabs.length === 0 && <p className="text-stone-400 py-0.5">No tabs in this group...</p>}

          <SortableContext items={group.tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
            {group.tabs.map((tab, j) => (
              <SortableItem key={tab.id} element="li" id={tab.id}>
                <TabItem key={tab.id} tab={tab} tabIndex={j} groupId={group.id} />
              </SortableItem>
            ))}
          </SortableContext>
          {/* <DragOverlay> */}
          {/*   {activeId ? <TabItem tab={groupState.tabs.find(tab => tab.id === activeId)} /> : null} */}
          {/* </DragOverlay> */}
        </ul>
      </DndContext>
    </Accordion.Panel>
  );
};
