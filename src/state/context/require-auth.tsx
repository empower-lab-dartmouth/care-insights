import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { loadPageDataFromFB } from '../fetching';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, pageContextState, queriesForCurrentCGState } from '../recoil';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const careRecipientInfo = useRecoilValue(careRecipientsInfoState);
  const location = useLocation();

  if (!currentUser) {
    console.log('are we getting here?', 'test', currentUser)
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to='/' state={{ from: location }} replace />;
  } else {
    console.log('are we getting here 2?')
    if (
      currentUser.email !== null &&
      pageState.insightsQuery.queryResponse === 'loading'
    ) {
      console.log('pulling info from remote');
      loadPageDataFromFB(currentUser.email, setPageState, setQueries, careRecipientInfo);
    } else{
      console.log('are we getting here 3?')
    }
  }

  return children;
}

export default RequireAuth;
