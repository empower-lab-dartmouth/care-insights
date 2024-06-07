/* eslint-disable require-jsdoc */
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { loadPageDataFromFB } from '../fetching';
import { useRecoilState } from 'recoil';
import { pageContextState } from '../recoil';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const [pageState, setPageState] = useRecoilState(pageContextState);
  // console.log(pageState); // useless call to avoid unused var
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    if (currentUser.email !== null &&
      pageState.insightsResponse === 'loading') {
      console.log('pulling info from remote');
      loadPageDataFromFB(currentUser.email, setPageState);
    }
  }

  return children;
}

export default RequireAuth;
