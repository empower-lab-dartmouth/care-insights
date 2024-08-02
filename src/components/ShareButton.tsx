import * as React from 'react';
import { Button, Center, Modal, Select, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShare2 } from '@tabler/icons-react';
import QRCode from "react-qr-code";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, pageContextState } from '../state/recoil';


interface ShareButtonProps {
  variant?: string;
  showIcon?: boolean;
  title: string;
  showButton?: boolean;
}

const ComponentToPrint = React.forwardRef((props, ref: any) => (
  <div ref={ref}>
    <QRCode value={window.location.href}/>
    </div>
));


const ShareButton = ({
  variant = 'outline',
  showIcon = true,
  title,
  showButton = true,
}: ShareButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const componentRef: any = React.useRef();
  const careRecipients = useRecoilValue(careRecipientsInfoState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const filename =
    careRecipients[pageContext.selectedCR] !== undefined
      ? careRecipients[pageContext.selectedCR].name + '_QR_Code' 
      : 'QR_Code';

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
          <Center>
        <div className='flex flex-col gap-3'>
            {/* <Select
            label='Caregiver'
            placeholder='Select a caregiver'
            data={['React', 'Angular', 'Vue', 'Svelte']}
          />
          <Textarea
            label='Message'
            placeholder='This will be sent as part of emal to caregiver.'
            rows={8}
          /> */}
            <ComponentToPrint ref={componentRef}/>
          <Button className='mt-2' onClick={() => exportComponentAsPNG(componentRef, {fileName: filename})}>Download QR Code</Button>
          {/* <Button className='mt-2'>Print QR Code</Button> */}
        </div>
          </Center>
      </Modal>
    </>
  );
};


export default ShareButton;
