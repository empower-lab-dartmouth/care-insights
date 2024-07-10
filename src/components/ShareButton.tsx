import { Button, Modal, Select, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShare2 } from '@tabler/icons-react';

interface ShareButtonProps {
  variant?: string;
  showIcon?: boolean;
  title: string;
  showButton?: boolean;
}

const ShareButton = ({
  variant = 'outline',
  showIcon = true,
  title,
  showButton = true,
}: ShareButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (showButton == false) return null;

  return (
    <>
      <Button
        leftSection={showIcon ? <IconShare2 size={18} /> : null}
        onClick={open}
        variant={variant}
      >
        Share
      </Button>

      <Modal opened={opened} onClose={close} title={title}>
        <div className='flex flex-col gap-3'>
          <Select
            label='Caregiver'
            placeholder='Select a caregiver'
            data={['React', 'Angular', 'Vue', 'Svelte']}
          />
          <Textarea
            label='Message'
            placeholder='This will be sent as part of emal to caregiver.'
            rows={8}
          />

          <Button className='mt-2'>Share</Button>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
