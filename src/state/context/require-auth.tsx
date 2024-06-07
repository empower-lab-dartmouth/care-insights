/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { loadPageDataFromFB } from '../fetching';
import { useRecoilState } from 'recoil';
import { pageContextState, queriesForCurrentCGState } from '../recoil';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    if (currentUser.email !== null &&
      pageState.insightsQuery.queryResponse === 'loading') {
      console.log('pulling info from remote');
      loadPageDataFromFB(currentUser.email, setPageState, setQueries);
    }
  }

  return children;
}

export default RequireAuth;
