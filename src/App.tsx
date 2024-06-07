/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// banstest
import * as React from 'react';
import {
  Routes, Route, useNavigate,
} from 'react-router-dom';
import './App.css';
import SignUp from './components/landing/signup';
import { useContext, useEffect } from 'react';
import { AuthContext } from './state/context/auth-context';
import RequireAuth from './state/context/require-auth';
import VideoAnalysis from './components/videoAnalysis/VideoAnalysis';
import SummaryInsights from './components/summaryInsights/SummaryInsights';
import Landing from './components/landing/landing';
import { useRecoilState } from 'recoil';
import { pageContextState } from './state/recoil';
import { loadPageDataFromFB } from './state/fetching';

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useRecoilState(pageContextState);

  useEffect(() => {
    if (currentUser &&
      pageState.insightsQuery.queryResponse === 'loading') {
      loadPageDataFromFB(currentUser?.email as string,
        setPageState);
      navigate('/summaryInsights');
    }
  }, [currentUser]);
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<RequireAuth>
        <SummaryInsights />
      </RequireAuth>} />

      <Route path="/summaryInsights" element={<RequireAuth>
        <SummaryInsights />
      </RequireAuth>} />

      <Route path="/videoAnalysis" element={<RequireAuth>
        <VideoAnalysis />
      </RequireAuth>} />

      <Route path="*" element={<FallBack />} />
    </Routes>
  );
};


const FallBack = () => {
  return <div>Not Found</div>;
};


export default App;
