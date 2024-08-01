import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchOnOpen, loadPageDataFromFB } from '../fetching';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, pageContextState, queriesForCurrentCGState, searchState } from '../recoil';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const careRecipientInfo = useRecoilValue(careRecipientsInfoState);
  const location = useLocation();
  const { search } = useLocation();
  const [searchURL, setSearchURL] = useRecoilState(searchState);


  if (!currentUser) {
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to={`/${search}`} state={{ from: location }} replace />;
  } else {
    if (
      currentUser.email !== null &&
      pageState.insightsQuery.queryResponse === 'loading'
    ) {
      console.log('pulling info from remote');
      // loadPageDataFromFB(currentUser.email, setPageState, setQueries, careRecipientInfo, pageState);
      fetchOnOpen(
        pageState,
        setPageState,
        queries,
        setQueries,
        searchURL,
        currentUser?.email as string,
        careRecipientInfo,
      );
    } else{
      console.log('No need to load data', currentUser.email, pageState.insightsQuery.queryResponse);
    }
  }

  return children;
}

export default RequireAuth;
