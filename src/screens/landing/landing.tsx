import React, { useEffect } from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { signInUser } from '../../state/firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
// import '../../App.css';
// import './landing.css';
import SignUp from './signup';

import { Button, Paper, Text, Input, Title, TextInput } from '@mantine/core';
import { useCookies } from 'react-cookie';
import { loadCareRecipientsInfo } from '../../state/fetching';
import { useRecoilState } from 'recoil';
import { careRecipientsInfoState, extededAttributesState, onOpenLoadingState, pageContextState } from '../../state/recoil';

const defaultFormFields = {
  email: '',
  password: ''
};

function Home() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [cookies, setCookie] = useCookies(['careInsightsUsername', 'careInsightsPassword']);
  const { search } = useLocation();
  const [loading, setLoading] = useRecoilState(onOpenLoadingState);
  const [careRecipientInfo, setCareRecipientInfo] = useRecoilState(
    careRecipientsInfoState
  );
  const [pageState, setPageState] = useRecoilState(pageContextState);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const [extendedAttributes, setExtendedAttributes] = useRecoilState(extededAttributesState);
  const [formFields, setFormFields] = useState((cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== '' &&
    cookies.careInsightsUsername !== '') ?
    {
      email: cookies.careInsightsUsername,
      password: cookies.careInsightsPassword
    } :
    defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async () => {
    try {
      // Send the email and password to firebase
      // console.log('handle submit ', email, password);
      const userCredential = await signInUser(email, password, setCookie);
      if (userCredential) {
        setLoading(true);
        await loadCareRecipientsInfo(
          pageState,
          setPageState,
          setCareRecipientInfo,
          email,
          password,
          setExtendedAttributes,
          'landing1'
          );
        resetFormFields();
        // console.log('user credentials');
        // console.log(userCredential);
        setLoading(false);
        // console.log('navigate to INFO');
        // navigate(`/info${search}`);
      } else {
        // setError('Sign in failed');
        alert('User Sign In Failed');
        setCookie('careInsightsUsername', '');
        setCookie('careInsightsPassword', '');
      }
    } catch (error: any) {
      // setError(error.message);
      console.log('TESTING');
      alert(error.message);
      setCookie('careInsightsUsername', '');
      setCookie('careInsightsPassword', '');
      console.log('User Sign In Failed', error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  useEffect(() => {
    async function fetch() {
      if (cookies.careInsightsPassword !== undefined &&
        cookies.careInsightsPassword !== undefined &&
        cookies.careInsightsPassword !== '' &&
        cookies.careInsightsUsername !== '') {
        await handleSubmit();
      }
    }

    fetch();
  }, [cookies]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[#238be6]'>
      <img src={'logo-white.svg'} alt='logo' className='w-[300px] pb-8' />
      <Paper shadow='xs' className='w-[400px] p-8'>
        <Title order={3} className='pb-1 text-center'>
          Welcome back{' '}
        </Title>
        <Text className='text-center'>Sign in to your account</Text>
        <div className='w-full flex flex-col gap-4 pt-4'>
          <TextInput
            label='Username: (Same as your Memcara Username)'
            placeholder='Username: (Same as your Memcara Username)'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />

          <TextInput
            label='Password: (Same as your Memcara Username)'
            type='password'
            placeholder='Password: (Same as your Memcara Username)'
            name='password'
            value={password}
            onChange={handleChange}
            required
          />

          <Button type='submit' onClick={handleSubmit}>
            Login
          </Button>
          <Button
            variant='transparent'
            onClick={() => handleOpen()}
            color='gray'
          >
            Create account
          </Button>
          <p>{error}</p>
        </div>
        {open && <SignUp opened={open} closeModal={() => handleClose()} />}
      </Paper>
    </div>
  );
}

export default Home;


