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
import { useRecoilState } from 'recoil';
import {
  careFacilitiesState,
  careRecipientsInfoState,
  caregiversInfoState,
  pageContextState,
  queriesForCurrentCGState,
} from './state/recoil';
import {
  loadCareGiverInfo,
  loadCareRecipientsInfo,
  loadFacilitiesInfo,
  loadPageDataFromFB,
} from './state/fetching';
import CareTeam from './screens/care-team/CareTeam';
import CareInsightsPage from './screens/summaryInsights/CareInsights';

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [caregiverInfo, setCaregiversInfo] =
    useRecoilState(caregiversInfoState);
  const [careRecipientInfo, setCareRecipientInfo] = useRecoilState(careRecipientsInfoState);
  const [___, setCareFacilityInfo] = useRecoilState(careFacilitiesState);


  useEffect(() => {
    async function fetch() {
      if (currentUser && pageState.insightsQuery.queryResponse === 'loading') {
        await loadCareRecipientsInfo(pageState, setPageState, setCareRecipientInfo);
        await loadPageDataFromFB(
          currentUser?.email as string,
          setPageState,
          setQueries,
          careRecipientInfo
        );
        await loadCareGiverInfo(
          pageState,
          setPageState,
          setCaregiversInfo,
          setCareFacilityInfo,
          currentUser?.email as string
        );
      }
    }

    fetch()
  }, [currentUser])


return (
  <Routes>
    <Route index element={<Landing />} />
    <Route path='/' element={<Landing />} />
    <Route path='/signup' element={<SignUp />} />

    <Route
      path='/'
      element={
        <RequireAuth>
          <SummaryInsights />
        </RequireAuth>
      }
    />

    <Route
      path='/info'
      element={
        <RequireAuth>
          <CareInsightsPage />

        </RequireAuth>
      }
    />

    <Route
      path='/questions'
      element={
        <RequireAuth>
          <SummaryInsights />
        </RequireAuth>
      }
    />
    <Route
      path='/program-events'
      element={
        <RequireAuth>
          <VideoAnalysis />
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
);
};

const FallBack = () => {
  return <div>Not Found</div>;
};

export default App;
