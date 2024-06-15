import React, { useState } from 'react';
import { handleSignUp } from '../../state/firebase/firebase';
import { Button, Input, Modal } from '@mantine/core';

export default function SignUp(props: any) {
  const [appear, setAppear] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleAppear = () => {
    setAppear(true);
  };

  const { closeModal, opened } = props;

  const [event, setEvent] = useState({
    email: '',
    password: '',
    confirm: '',
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
    const password = event.password;
    const confirm = event.confirm;
    const name = event.name;

    console.log(event);

    if (name === '') {
      console.log('must enter a name');
      setMessage('Please enter your name');
      return;
    } else {
      setMessage('');
    }

    if (email === '') {
      console.log('must enter an email');
      setMessage('Please enter your email address');
      return;
    } else {
      setMessage('');
    }

    if (password === confirm) {
      const res = await handleSignUp(email, password, name);
      if (typeof res === 'string') {
        setMessage(res);
      }
    } else {
      setMessage('The passwords do not match');
    }

    handleAppear();
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title='Create new account'
      centered
    >
      <div className='flex flex-col gap-4 p-2'>
        <Input.Wrapper label='Name'>
          <Input
            type='text'
            name='name'
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </Input.Wrapper>

        <Input.Wrapper label='Email'>
          <Input
            type='email'
            name='email'
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </Input.Wrapper>

        <Input.Wrapper label='Password'>
          <Input
            type='password'
            name='password'
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </Input.Wrapper>

        <Input.Wrapper label='Confirm Password'>
          <Input
            type='password'
            name='confirm'
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </Input.Wrapper>

        {appear && (
          <span className='text-sm text-red-600 text-center'>{message}</span>
        )}

        <Button onClick={handleSubmit}>New Account</Button>
      </div>
      {/* <div className='modal'>
        <div className='landing-card'>
          <form onSubmit={handleSubmit} className='group' autoComplete='off'>
            <div>
              <input
                placeholder='Email'
                type='text'
                name='email'
                onChange={handleChange}
                style={{ backgroundColor: 'white', color: 'black' }}
                autoComplete='off'
              />
            </div>

            <div>
              <input
                placeholder='Password'
                type='password'
                name='password'
                onChange={handleChange}
                style={{ backgroundColor: 'white', color: 'black' }}
                autoComplete='off'
              />
            </div>

            <div>
              <input
                placeholder='Confirm Password'
                type='password'
                name='confirm'
                onChange={handleChange}
                style={{ backgroundColor: 'white', color: 'black' }}
              />
            </div>
            <div>
              <input
                placeholder='Name'
                type='text'
                name='name'
                onChange={handleChange}
                style={{ backgroundColor: 'white', color: 'black' }}
                autoComplete='off'
              />
            </div>

            {appear && <span className='error-msg'>{message}</span>}

            <div>
              <input
                id='signup'
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  fontWeight: 'bold',
                  height: '60px',
                  color: 'black',
                }}
                type='submit'
              />
              <Button
                style={{
                  cursor: 'pointer',
                  fontWeight: 'normal',
                  color: 'gray',
                  backgroundColor: 'white',
                  height: '60px',
                }}
                onClick={() => closeModal()}
              >
                {' '}
                Back{' '}
              </Button>
            </div>
          </form>
        </div>
      </div> */}
    </Modal>
  );
}
