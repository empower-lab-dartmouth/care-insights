import * as React from 'react';
import { Button, Center, Modal, Select, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShare2 } from '@tabler/icons-react';
import QRCode from "react-qr-code";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, extededAttributesState, pageContextState } from '../state/recoil';
import { AuthContext } from '../state/context/auth-context';


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
  const { currentUser } = React.useContext(AuthContext);
  const refEmail = currentUser?.email != null ? currentUser.email : 'true';
  const componentRef: any = React.useRef();
  const careRecipients = useRecoilValue(careRecipientsInfoState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const filename =
    careRecipients[pageContext.selectedCR] !== undefined
      ? careRecipients[pageContext.selectedCR].name + '_QR_Code.png'
      : 'QR_Code.png';
  const extendedAttributes = useRecoilValue(extededAttributesState);
  const CRName1 =
    careRecipients[pageContext.selectedCR] !== undefined
      ? careRecipients[pageContext.selectedCR].name
      : 'NONE';
  const CRName = extendedAttributes[pageContext.selectedCR] !== undefined ?
    extendedAttributes[pageContext.selectedCR].firstName + ' ' + extendedAttributes[pageContext.selectedCR].lastName : CRName1;

  const getURL = () => {
    const u = new URL(window.location.href);
    u.searchParams.set('qrcode', refEmail);
    return u.toString().replace('&dev=true', '').replace('&geo=false', '');
  }
  const ComponentToPrint = React.forwardRef((props, ref: any) => (
    <div ref={ref}>
      <Center style={{padding: 20}}>
      <QRCode value={getURL()} />
      </Center>
      <Center>
        {CRName !== 'NONE' ?
      <h1 style={{fontSize: 27}}><b style={{color: 'red'}}>Memcara Dementia Care Tools</b><br /><br /><Center style={{color: 'darkblue'}}>Privacy protected data regarding </Center><Center><br /><br /><b>{CRName}</b></Center></h1> : <></>}
      </Center>
    </div>
  ));

  if (showButton == false) return null;

  return (
    <>
      {CRName === 'NONE' ? <></> :
        <>
          <Button
            leftSection={showIcon ? <IconShare2 size={18} /> : null}
            onClick={open}
            variant={variant}
          >
            Download QR Code for {CRName}
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
                <ComponentToPrint ref={componentRef} />
                <Button className='mt-2' onClick={() => exportComponentAsPNG(componentRef, { fileName: filename })}>Download QR Code</Button>
                {/* <Button className='mt-2'>Print QR Code</Button> */}
              </div>
            </Center>
          </Modal>
        </>
      }
    </>
  );
};


export default ShareButton;
