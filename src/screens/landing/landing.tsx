import React from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { signInUser } from '../../state/firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
// import '../../App.css';
// import './landing.css';
import SignUp from './signup';

import { Button, Paper, Text, Input, Title, TextInput } from '@mantine/core';
import { useCookies } from 'react-cookie';

const defaultFormFields = {
  email: '',
  password: ''
};

function Home() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [cookies, setCookie] = useCookies(['careInsightsUsername', 'careInsightsPassword']);
  const { search } = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
      console.log(email, password);
      const userCredential = await signInUser(email, password, setCookie);

      console.log('user credentials');
      console.log(userCredential);

      if (userCredential) {
        resetFormFields();
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
  if (cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== '' &&
    cookies.careInsightsUsername !== '') {
    handleSubmit();
  }
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
            label='Email'
            placeholder='Your email'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />

          <TextInput
            label='Password'
            type='password'
            placeholder='Your password'
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
