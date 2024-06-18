import React from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { signInUser } from '../../state/firebase/firebase';
import { useNavigate } from 'react-router-dom';
// import '../../App.css';
// import './landing.css';
import SignUp from './signup';

import { Button, Paper, Text, Input, Title } from '@mantine/core';

const defaultFormFields = {
  email: '',
  password: '',
};

function Home() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async () => {
    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        resetFormFields();
        navigate('/summaryInsights');
      }
    } catch (error: any) {
      console.log('User Sign In Failed', error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[#238be6]'>
      <Paper shadow='xs' className='w-[400px] p-8'>
        <Title order={3} className='pb-1'>
          Welcome back!
        </Title>
        <Text>Sign in to your account</Text>
        <form className='w-full flex flex-col gap-4 pt-4'>
          <Input.Wrapper label='Email'>
            <Input
              placeholder='Your email address'
              type='email'
              name='email'
              value={email}
              onChange={handleChange}
              required
            />
          </Input.Wrapper>
          <Input.Wrapper label='Password'>
            <Input
              placeholder='Your password'
              type='password'
              name='password'
              value={password}
              onChange={handleChange}
              required
            />
          </Input.Wrapper>

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
        </form>
        {open && <SignUp opened={open} closeModal={() => handleClose()} />}
      </Paper>
    </div>
  );
}

export default Home;
