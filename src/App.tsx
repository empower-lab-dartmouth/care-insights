import * as React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// import './App.css';
import SignUp from './components/landing/signup';
import { useContext, useEffect } from 'react';
import { AuthContext } from './state/context/auth-context';
import RequireAuth from './state/context/require-auth';
import VideoAnalysis from './components/videoAnalysis/VideoAnalysis';
import SummaryInsights from './components/summaryInsights/SummaryInsights';
import Landing from './components/landing/landing';
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
import CareTeam from './components/care-team/CareTeam';

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [caregiverInfo, setCaregiversInfo] =
    useRecoilState(caregiversInfoState);
  const [__, setCareRecipientInfo] = useRecoilState(careRecipientsInfoState);
  const [___, setCareFacilityInfo] = useRecoilState(careFacilitiesState);

  useEffect(() => {
    if (currentUser && pageState.insightsQuery.queryResponse === 'loading') {
      loadPageDataFromFB(
        currentUser?.email as string,
        setPageState,
        setQueries
      );
      loadCareGiverInfo(
        pageState,
        setPageState,
        setCaregiversInfo,
        setCareFacilityInfo,
        currentUser?.email as string
      );
      loadCareRecipientsInfo(pageState, setPageState, setCareRecipientInfo);
      navigate('/summaryInsights');
    }
  }, [currentUser]);
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
        path='/summaryInsights'
        element={
          <RequireAuth>
            <SummaryInsights />
          </RequireAuth>
        }
      />

      <Route
        path='/videoAnalysis'
        element={
          <RequireAuth>
            <VideoAnalysis />
          </RequireAuth>
        }
      />

      <Route
        path='/careTeam'
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
