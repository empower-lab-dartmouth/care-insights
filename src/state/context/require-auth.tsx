import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchOnOpen, loadPageDataFromFB } from '../fetching';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, extededAttributesState, onOpenLoadingState, pageContextState, queriesForCurrentCGState, searchState } from '../recoil';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const careRecipientInfo = useRecoilValue(careRecipientsInfoState);
  const location = useLocation();
  const { search } = useLocation();
  const [searchURL, setSearchURL] = useRecoilState(searchState);
  const [_, setLoading] = useRecoilState(onOpenLoadingState);
  const extendedAttributes = useRecoilValue(extededAttributesState);
  
  useEffect(() => {
    async function fetch() {
      if (!currentUser || !currentUser.email || currentUser == null) {
        // Redirect the user to the home page.
        // Please! Close the mustache {{}}
        return <Navigate to={`/${search}`} state={{ from: location }} replace />;
      } else {
        if (
          (currentUser.email !== null) || Object.values(careRecipientInfo).length === 0
        ) {
          // console.log('pulling info from remote from require auth', currentUser.email);
          // loadPageDataFromFB(currentUser.email, setPageState, setQueries, careRecipientInfo, pageState);
          fetchOnOpen(
            pageState,
            setPageState,
            queries,
            setQueries,
            searchURL,
            currentUser?.email as string,
            careRecipientInfo,
            setSearchURL,
            setLoading,
            extendedAttributes[pageState.selectedCR]
          );
        } else{
          // console.log('No need to load data', currentUser.email, pageState.insightsQuery.queryResponse);
        }
      }
    }

    fetch();
  }, [currentUser]);

  
  return children;
}

export default RequireAuth;
