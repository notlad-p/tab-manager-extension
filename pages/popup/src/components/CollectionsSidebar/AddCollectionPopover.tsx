import { collectionsStorage } from '@chrome-extension-boilerplate/storage';
import { Popover, TextInput, Button, ActionIcon, rem, ColorInput, ColorPicker, Collapse } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import type { FormEvent } from 'react';

const AddCollectionPopover = () => {
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [swatchesOpen, setSwatchesOpen] = useState(false);

  const handleCreateCollection = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('create collection');

    collectionsStorage.createCollection({ name, color });

    // reset state
    setName('');
    setColor('#3b82f6');
    setSwatchesOpen(false);

    // close popover
    setPopoverIsOpen(false);
  };

  const resetFormValues = () => {
    console.log('reset');
  };

  return (
    <Popover
      width={244}
      opened={popoverIsOpen}
      onChange={setPopoverIsOpen}
      onClose={resetFormValues}
      trapFocus
      position="right-start"
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon variant="default" size={18} onClick={() => setPopoverIsOpen(o => !o)}>
          <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <form className="flex flex-col gap-2" onSubmit={handleCreateCollection}>
          <TextInput
            label="Name"
            value={name}
            onChange={event => setName(event.currentTarget.value)}
            placeholder="Collection Name"
            size="xs"
          />

          <ColorInput
            placeholder="Collection color"
            label="Color"
            size="xs"
            disallowInput
            withPicker={false}
            value={color}
            onClick={() => setSwatchesOpen(o => !o)}
          />

          <Collapse in={swatchesOpen}>
            <ColorPicker
              size="xs"
              format="hex"
              value={color}
              onChange={setColor}
              withPicker={false}
              fullWidth
              swatchesPerRow={8}
              swatches={[
                '#ef4444',
                '#f97316',
                '#f59e0b',
                '#eab308',
                '#84cc16',
                '#22c55e',
                '#10b981',
                '#14b8a6',
                '#06b6d4',
                '#0ea5e9',
                '#3b82f6',
                '#6366f1',
                '#8b5cf6',
                '#a855f7',
                '#d946ef',
                '#ec4899',
                // '#f43f5e',
              ]}
            />
          </Collapse>

          <div className="flex items-end justify-end">
            <Button type="submit" size="xs">
              Create
            </Button>
          </div>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default AddCollectionPopover;
