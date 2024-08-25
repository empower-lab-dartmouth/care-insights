import React, { useState } from 'react';
import { handleSignUp } from '../../state/firebase/firebase';
import { Button, Input, Modal, TextInput } from '@mantine/core';
import { reportTrackingEventNoPageContext } from '../../state/tracking';

const subject = (name: string, caregiverType: string, email: string) => {
  return `Add New CareSuite User: ${name}`
}

const body = (name: string, caregiverType: string, email: string) => {
  return `Hi,
My name is ${name}, my email is ${email}, my caregiver type is ${caregiverType}. I would like to access Care Insights. Please go to CareSuite and add me as a caregiver. Thank you,

Sincerely,
${name}`
}

export default function SignUp(props: any) {
  const [appear, setAppear] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [hasClickedCreate, setHasClickedCreate] = React.useState(false);

  const handleAppear = () => {
    setAppear(true);
  };

  const { closeModal, opened } = props;

  const [event, setEvent] = useState({
    email: '',
    type: '',
    name: '',
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEvent({
      ...event,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async () => {
    const email = event.email;
    const type = event.type;
    const name = event.name;

    // console.log(event);

    if (name === '') {
      // console.log('must enter a name');
      setMessage('Please enter your name');
      handleAppear();
      return;
    } else {
      setMessage('');
    }

    if (email === '') {
      setMessage('Please enter your email address');
      handleAppear();
      return;
    } else {
      setMessage('');
    }

    if (type === '') {
      setMessage('Please enter something for caregiver type.');
      handleAppear();
      return;
    } else {
      setMessage('');
    }
    reportTrackingEventNoPageContext({
      type: 'new-user-request',
      email,
      userType: type,
      name,
    }, 'new-user', 'NONE');
    window.location.assign(`mailto:info@memcara.com?subject=${subject(name, type, email)}&body=${body(name, type, email)}`);
    setHasClickedCreate(true);
    // const res = await handleSignUp(email, type, name);
    //   if (typeof res === 'string') {
    //     setMessage(res);
    //   }
    // } else {
    //   setMessage('The passwords do not match');

  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title='Get support logging in'
      centered
    >
      <div className='flex flex-col gap-4 p-2'>
        {hasClickedCreate ? <h1>An email draft has been created for you, please review and send this. Once you do, we will create an account for you and respond with more info. If you have any further questions or concerns, contact info@memcara.com.</h1> : <>
          <p>Please enter your information below and we'll help get you set up.</p>
          <TextInput
            label='Name'
            type='text'
            name='name'
            onChange={handleChange}
            autoComplete='off'
            required
          />

          <TextInput
            label='Email'
            type='email'
            name='email'
            onChange={handleChange}
            autoComplete='off'
            required
          />

          <TextInput
            label='Caregiver role (e.g. family member, volunteer, full time)'
            type='text'
            name='type'
            onChange={handleChange}
            autoComplete='off'
            required
          />
          {appear && (
            <span className='text-sm text-red-600 text-center'>{message}</span>
          )}
          <Button onClick={handleSubmit}>Create</Button>
        </>}
      </div>
    </Modal>
  );
}
