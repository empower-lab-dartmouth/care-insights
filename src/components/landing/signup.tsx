/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import { handleSignUp } from '../../state/firebase/firebase';
import './modal.css';
import Button from '@mui/base/Button';

export default function SignUp(props: any) {
  const [appear, setAppear] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleAppear = () => {
    setAppear(true);
  };

  const {
    closeModal,
  } = props;

  const [event, setEvent] = useState({
    email: '', password: '', confirm: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> |
    React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEvent({
      ...event,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    const confirm = event.target[2].value;
    const name = event.target[3].value;

    if (name === '') {
      console.log('must enter a name');
      setMessage('Please enter your name');
      handleAppear();
      return;
    } else {
      setMessage('');
      handleAppear();
    }

    if (password === confirm) {
      const res = await handleSignUp(email, password, name);
      if (typeof (res) === 'string') {
        setMessage(res);
        handleAppear();
      }
    } else {
      console.log('The passwords do not match');
    }
  };


  return (
    <div className="modal">
      <div className="landing-card">
        <form onSubmit={handleSubmit}
          className='group'
          autoComplete='off'
        >
          <div>
            <input placeholder='Email' type="text" name="email"
              onChange={handleChange}
              style={{ backgroundColor: 'white', color: 'black' }}
              autoComplete="off" />
          </div>

          <div>
            <input placeholder='Password' type="password" name="password"
              onChange={handleChange}
              style={{ backgroundColor: 'white', color: 'black' }}
              autoComplete="off" />
          </div>

          <div>
            <input placeholder='Confirm Password' type="password" name="confirm"
              onChange={handleChange}
              style={{ backgroundColor: 'white', color: 'black' }} />
          </div>
          <div>
            <input placeholder='Name' type="text" name="name"
              onChange={handleChange}
              style={{ backgroundColor: 'white', color: 'black' }}
              autoComplete="off" />
          </div>

          {appear && (
            <span className='error-msg'>{message}</span>
          )}

          <div>
            <input id='signup'
              style={{
                cursor: 'pointer',
                backgroundColor: 'white',
                fontWeight: 'bold',
                height: '60px', color: 'black'
              }}
              type="submit" /><Button style={{
                cursor: 'pointer',
                fontWeight: 'normal',
                color: 'gray',
                backgroundColor: 'white',
                height: '60px'
              }} onClick={
                () => closeModal()}> Back </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
