import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { updateCollection, updateGroup, useCollectionsStore } from '@src/state/collections';

import type { ReactNode } from 'react';
import type { CollisionDetection, DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import TabItem from '../TabGroups/TabItem';
import type { Tab } from '@chrome-extension-boilerplate/storage';
import GroupOverlay from './GroupOverlay';

type CustomDndContextProps = {
  children: ReactNode;
};

export const CustomDndContext = ({ children }: CustomDndContextProps) => {
  const [activeId, setActiveId] = useState<{ id: UniqueIdentifier; type: 'tab' | 'group' } | null>(null);
  const activeCollection = useCollectionsStore(state =>
    state?.collections?.find(col => col.id === state.activeCollectionId),
  );

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [activeCollection]);

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'group') {
      return activeCollection?.groups.find(group => group.id === id);
    }
    if (type === 'tab') {
      return activeCollection?.groups.find(group => group.tabs.find(tab => tab.id === id));
    }
  }

  const findTab = (id: UniqueIdentifier | undefined): Tab => {
    const group = findValueOfItems(id, 'tab');
    const defaultTab = { id: '', title: 'Tab Title', url: '', favIconUrl: '' };
    if (!group) return defaultTab;
    const tab = group.tabs.find(tab => tab.id === id);
    if (!tab) return defaultTab;
    return tab;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    args => {
      if (activeId && activeId.type === 'group' && activeCollection) {
        const groupIds = activeCollection.groups.map(group => group.id) as UniqueIdentifier[];
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => groupIds.includes(container.id)),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null && activeCollection) {
        // if (overId === TRASH_ID) {
        //   // If the intersecting droppable is the trash, return early
        //   // Remove this if you're not using trashable functionality in your app
        //   return intersections;
        // }

        const groupIds = activeCollection.groups.map(group => group.id) as UniqueIdentifier[];
        if (groupIds.includes(overId)) {
          // const containerItems = items[overId];
          const containerItems = activeCollection.groups
            .find(group => group.id === overId)
            ?.tabs.map(tab => tab.id) as UniqueIdentifier[];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems && containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                container => container.id !== overId && containerItems.includes(container.id),
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current && activeId) {
        lastOverId.current = activeId.id;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, activeCollection],
  );

  function handleDragStart(event: DragStartEvent) {
    // Set active ID used for DragOverlay
    const { active } = event;
    const { id } = active;

    if (active.data.current) {
      setActiveId({ id, type: active.data.current.type });
    }
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      activeCollection &&
      active &&
      over &&
      active.data.current &&
      over.data.current &&
      active.data.current.type === 'tab' &&
      over.data.current.type === 'tab' &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'tab');
      const overContainer = findValueOfItems(over.id, 'tab');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = activeCollection.groups.findIndex(group => group.id === activeContainer.id);
      const overContainerIndex = activeCollection.groups.findIndex(group => group.id === overContainer.id);

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tabs.findIndex(tab => tab.id === active.id);
      const overitemIndex = overContainer.tabs.findIndex(tab => tab.id === over.id);

      // In the same group
      if (activeContainerIndex === overContainerIndex) {
        // Update tabs
        updateGroup({
          collectionId: activeCollection.id,
          groupId: overContainer.id,
          callback: group => {
            const newTabs = arrayMove(group.tabs, activeitemIndex, overitemIndex);
            return { ...group, tabs: newTabs };
          },
        });
      } else {
        // In different containers
        updateCollection({
          collectionId: activeCollection.id,
          callback: collection => {
            const newGroups = [...collection.groups];
            const [removedItem] = newGroups[activeContainerIndex].tabs.splice(activeitemIndex, 1);
            newGroups[overContainerIndex].tabs.splice(overitemIndex, 0, removedItem);
            return { ...collection, groups: newGroups };
          },
        });
      }
    }

    // Handling Item Drop Into a Container
    if (
      activeCollection &&
      active &&
      over &&
      active.data.current &&
      over.data.current &&
      active.data.current.type === 'tab' &&
      over.data.current.type === 'group' &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'tab');
      const overContainer = findValueOfItems(over.id, 'tab');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = activeCollection.groups.findIndex(group => group.id === activeContainer.id);
      const overContainerIndex = activeCollection.groups.findIndex(group => group.id === overContainer.id);

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tabs.findIndex(tab => tab.id === active.id);

      // Remove the active item from the active container and add it to the over container
      updateCollection({
        collectionId: activeCollection.id,
        callback: collection => {
          const newItems = [...collection.groups];
          const [removedItem] = newItems[activeContainerIndex].tabs.splice(activeitemIndex, 1);
          newItems[overContainerIndex].tabs.push(removedItem);

          return { ...collection, groups: newItems };
        },
      });
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active &&
      over &&
      active.data.current &&
      over.data.current &&
      active.data.current.type === 'group' &&
      over.data.current.type === 'group' &&
      active.id !== over.id &&
      activeCollection
    ) {
      // Find the index of the active and over container
      updateCollection({
        collectionId: activeCollection.id,
        callback: collection => {
          const activeContainerIndex = collection.groups.findIndex(group => group.id === active.id);
          const overContainerIndex = collection.groups.findIndex(group => group.id === over.id);
          // Swap the active and over container
          let newGroups = [...collection.groups];
          newGroups = arrayMove(newGroups, activeContainerIndex, overContainerIndex);
          return { ...collection, groups: newGroups };
        },
      });
    }

    // Handle Items Sorting
    if (
      activeCollection &&
      active &&
      over &&
      active.data.current &&
      over.data.current &&
      active.data.current.type === 'tab' &&
      over.data.current.type === 'tab' &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'tab');
      const overContainer = findValueOfItems(over.id, 'tab');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = activeCollection.groups.findIndex(group => group.id === activeContainer.id);
      const overContainerIndex = activeCollection.groups.findIndex(group => group.id === overContainer.id);

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tabs.findIndex(tab => tab.id === active.id);
      const overitemIndex = overContainer.tabs.findIndex(tab => tab.id === over.id);

      // In the same group
      if (activeContainerIndex === overContainerIndex) {
        // Update tabs
        updateCollection({
          collectionId: activeCollection.id,
          callback: collection => {
            const newGroups = [...collection.groups];

            newGroups[activeContainerIndex].tabs = arrayMove(
              newGroups[activeContainerIndex].tabs,
              activeitemIndex,
              overitemIndex,
            );

            return { ...collection, groups: newGroups };
          },
        });
      } else {
        // In different containers
        updateCollection({
          collectionId: activeCollection.id,
          callback: collection => {
            const newGroups = [...collection.groups];
            const [removedItem] = newGroups[activeContainerIndex].tabs.splice(activeitemIndex, 1);
            newGroups[overContainerIndex].tabs.splice(overitemIndex, 0, removedItem);
            return { ...collection, groups: newGroups };
          },
        });
      }
    }

    // Handling Item Drop Into a Container
    if (
      activeCollection &&
      active &&
      over &&
      active.data.current &&
      over.data.current &&
      active.data.current.type === 'tab' &&
      over.data.current.type === 'group' &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'tab');
      const overContainer = findValueOfItems(over.id, 'tab');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = activeCollection.groups.findIndex(group => group.id === activeContainer.id);
      const overContainerIndex = activeCollection.groups.findIndex(group => group.id === overContainer.id);

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tabs.findIndex(tab => tab.id === active.id);

      // Remove the active item from the active container and add it to the over container
      updateCollection({
        collectionId: activeCollection.id,
        callback: collection => {
          const newItems = [...collection.groups];
          const [removedItem] = newItems[activeContainerIndex].tabs.splice(activeitemIndex, 1);
          newItems[overContainerIndex].tabs.push(removedItem);

          return { ...collection, groups: newItems };
        },
      });
    }
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragMove}
      onDragStart={handleDragStart}
    >
      {children}
      <DragOverlay adjustScale={false}>
        {/* Drag Overlay For item Item */}
        {activeId && activeId.type === 'tab' && <TabItem tab={findTab(activeId.id)} />}
        {/* Drag Overlay For Container */}
        {activeId && activeId.type === 'group' && <GroupOverlay groupId={activeId.id} />}
      </DragOverlay>
    </DndContext>
  );
};
