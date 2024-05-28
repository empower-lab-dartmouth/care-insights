/* eslint-disable require-jsdoc */
import React from 'react';
import {useContext} from 'react';
import {AuthContext} from './auth-context';
import {Navigate, useLocation} from 'react-router-dom';
import {loadLastUserServerValues} from '../../components/landing/landing';

function RequireAuth({children}: { children:JSX.Element }) {
  const {currentUser} = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to="/" state={ {from: location} } replace />;
  } else {
    if (currentUser.email !== null) {
      console.log('pulling info from remote');
      loadLastUserServerValues(currentUser.email);
    }
  }

  return children;
}

export default RequireAuth;
