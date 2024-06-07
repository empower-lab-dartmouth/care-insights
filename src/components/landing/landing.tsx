/* eslint-disable require-jsdoc, no-unused-vars */
import React from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { signInUser } from '../../state/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './landing.css';
import SignUp from './signup';

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
    return (
      setFormFields(defaultFormFields)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
    <div className='login-container'>
      <div className="App-header">
        <div className='login-header-img'
          style={{
            marginTop: '-200px', marginBottom: '5px',
            height: '150px', width: '600px'
          }}
        />
        <button className='sign-up'
          onClick={() => handleOpen()}>
          Create account
        </button>
        <div className='landing-card'>
          <form onSubmit={handleSubmit}
            className='group'
          >
            <div>
              <input
                style={{
                  backgroundColor: 'white',
                  color: 'black'
                }}
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <input
                style={{
                  backgroundColor: 'white',
                  color: 'black'
                }}
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <div>
              <input id='login'
                style={{
                  backgroundColor: 'white',
                  color: 'black', cursor: 'pointer'
                }}
                type="submit" />
            </div>
          </form>
          {open && (
            <SignUp
              closeModal={() => handleClose()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
