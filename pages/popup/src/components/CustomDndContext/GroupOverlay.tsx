import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCollectionsStore } from '@src/state/collections';
import GroupContainer from '../TabGroups/GroupContainer';
import { SortableItem } from '../CustomDndContext/SortableItem';
import TabItem from '../TabGroups/TabItem';
import type { Group } from '@chrome-extension-boilerplate/storage';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { Accordion } from '@mantine/core';

type GroupOverlayProps = {
  groupId: UniqueIdentifier;
};

const GroupOverlay = ({ groupId }: GroupOverlayProps) => {
  const activeCollectionId = useCollectionsStore(state => state.activeCollectionId);
  const group = useCollectionsStore(state =>
    state?.collections?.find(col => col.id === state.activeCollectionId)?.groups.find(grp => grp.id === groupId),
  ) as Group;

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
      defaultValue={group.isOpen ? [`${activeCollectionId}-${group.id}`] : []}
    >
      <GroupContainer group={group}>
        <SortableContext items={group.tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
          {group.tabs.map(tab => (
            <SortableItem key={tab.id} element="li" id={tab.id} data={{ type: 'tab', groupId: group.id }}>
              <TabItem tab={tab} groupId={group.id} />
            </SortableItem>
          ))}
        </SortableContext>
      </GroupContainer>
    </Accordion>
  );
};

export default GroupOverlay;
