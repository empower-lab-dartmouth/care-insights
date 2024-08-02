import * as React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// import './App.css';
import SignUp from './screens/landing/signup';
import { useContext, useEffect } from 'react';
import { AuthContext } from './state/context/auth-context';
import RequireAuth from './state/context/require-auth';
import VideoAnalysis from './screens/videoAnalysis/VideoAnalysis';
import SummaryInsights from './screens/summaryInsights/SummaryInsights';
import Landing from './screens/landing/landing';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  careFacilitiesState,
  careRecipientsInfoState,
  caregiversInfoState,
  onOpenLoadingState,
  pageContextState,
  queriesForCurrentCGState,
  searchState,
} from './state/recoil';
import {
  fetchOnOpen,
  loadCareGiverInfo,
  loadCareRecipientsInfo,
  loadPageDataFromFB,
  loadQueryFromURL,
} from './state/fetching';
import CareTeam from './screens/care-team/CareTeam';
import CareInsightsPage from './screens/summaryInsights/CareInsights';
import { CookiesProvider } from 'react-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from './components/UserShell';


const App = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [caregiverInfo, setCaregiversInfo] =
    useRecoilState(caregiversInfoState);
  const [careRecipientInfo, setCareRecipientInfo] = useRecoilState(
    careRecipientsInfoState
  );
  const [searchURL, setSearchURL] = useRecoilState(searchState);
  const [loading, setLoading] = useRecoilState(onOpenLoadingState);

  useEffect(() => {
    async function fetch() {
      if (currentUser && pageState.insightsQuery.queryResponse === 'loading') {
        setLoading(true);
        await loadCareRecipientsInfo(
          pageState,
          setPageState,
          setCareRecipientInfo
        );
        // const q = await fetchOnOpen(
        //   pageState,
        //   setPageState,
        //   queries,
        //   setQueries,
        //   searchURL,
        //   currentUser?.email as string,
        //   careRecipientInfo,
        //   setSearchURL,
        //   setLoading
        // );
          setLoading(false);
      }
    }

    fetch();
  }, [currentUser]);

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Routes>
        <Route index element={<Landing />} />
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<SignUp />} />

        <Route
          path='/'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <CircularProgress />
              </UserShell> : <SummaryInsights />}
            </RequireAuth>
          }
        />

        <Route
          path='/info'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <CircularProgress />
              </UserShell> : <CareInsightsPage />}
            </RequireAuth>
          }
        />

        <Route
          path='/questions'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <CircularProgress />
              </UserShell> : <SummaryInsights />}
            </RequireAuth>
          }
        />
        <Route
          path='/program-events'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <CircularProgress />
              </UserShell> : <VideoAnalysis />}
            </RequireAuth>
          }
        />

        <Route
          path='/care-team'
          element={
            <RequireAuth>
              <CareTeam />
            </RequireAuth>
          }
        />

        <Route path='*' element={<FallBack />} />
      </Routes>
    </CookiesProvider>
  );
};

const FallBack = () => {
  return <div>Not Found</div>;
};

export default App;
