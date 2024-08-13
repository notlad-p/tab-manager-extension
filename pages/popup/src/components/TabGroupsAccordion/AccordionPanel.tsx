import { Accordion } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Link } from '../Link/Link';

import { useStorageSuspense } from '@chrome-extension-boilerplate/shared';
import { Tab, collectionsStorage, type Group } from '@chrome-extension-boilerplate/storage';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TabItem from './TabItem';
import { SortableItem } from './SortableItem';
import { useState } from 'react';

type AccordionPanelProps = {
  collectionId: number;
  group: Group;
};

export const AccordionPanel = ({ collectionId, group }: AccordionPanelProps) => {
  const [groupState, setGroupState] = useState(group);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
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
      // TODO: put group into state & optimistically update order
      // - Make this less janky???
      setGroupState(grp => {
        const oldIndex = grp.tabs.findIndex(tab => tab.id === active.id);
        const newIndex = grp.tabs.findIndex(tab => tab.id === over.id);
        return { ...grp, tabs: arrayMove(group.tabs, oldIndex, newIndex) };
      });

      collectionsStorage.updateGroup({
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
          {groupState.tabs.length === 0 && <p className="text-stone-400 py-0.5">No tabs in this group...</p>}

          <SortableContext items={groupState.tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
            {groupState.tabs.map((tab, j) => (
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
