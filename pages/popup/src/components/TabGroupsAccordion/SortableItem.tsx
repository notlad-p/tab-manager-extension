import React, { ElementType, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
  element: ElementType;
  children: ReactNode;
  id: string;
  data?: any;
};

// NOTE: using wrapper node instead of forwarding ref
// https://docs.dndkit.com/api-documentation/draggable/drag-overlay#wrapper-nodes
export const SortableItem: React.FC<SortableItemProps> = props => {
  const Element = props.element || 'div';
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id, data: props.data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Element ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </Element>
  );
};
