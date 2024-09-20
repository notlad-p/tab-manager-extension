import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Accordion } from '@mantine/core';
import { useCollectionsStore } from '@src/state/collections';

import GroupContainer from './GroupContainer';
import TabItem from './TabItem';
import { SortableItem } from '../CustomDndContext/SortableItem';

export const TabGroups = () => {
  const collections = useCollectionsStore(state => state);
  const activeCollection = useCollectionsStore(state =>
    state.collections?.find(col => col.id === collections.activeCollectionId),
  );

  const openGroupIds = useCollectionsStore(state => {
    const activeColl = state.collections?.find(col => col.id === collections.activeCollectionId);

    return activeColl?.groups
      .map(group => (group.isOpen ? `${activeColl.id}-${group.id}` : ''))
      .filter(group => group !== '');
  });

  if (activeCollection) {
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
        defaultValue={openGroupIds}
      >
        <SortableContext items={activeCollection?.groups.map(group => group.id)} strategy={verticalListSortingStrategy}>
          {activeCollection?.groups.map(group => (
            <GroupContainer key={group.id} group={group}>
              <SortableContext items={group.tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
                {group.isOpen &&
                  group.tabs.map(tab => (
                    <SortableItem key={tab.id} element="li" id={tab.id} data={{ type: 'tab', groupId: group.id }}>
                      <TabItem tab={tab} groupId={group.id} />
                    </SortableItem>
                  ))}
              </SortableContext>
            </GroupContainer>
          ))}
        </SortableContext>
      </Accordion>
    );
  }

  return null;
};
