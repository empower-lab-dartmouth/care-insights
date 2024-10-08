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
  extededAttributesState,
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
import { useCookies } from 'react-cookie';
import { Button } from '@mui/material';
import { updateCache } from './state/globals';
import SupportPage from './state/SupportPage';
import ReelsPage from './screens/reels/ReelsPage';

const defaultFormFields = {
  email: '',
  password: ''
};

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [cookies, setCookie] = useCookies(['careInsightsUsername', 'careInsightsPassword']);
  const [extendedAttributes, setExtendedAttributes] = useRecoilState(extededAttributesState);
  const [caregiverInfo, setCaregiversInfo] =
    useRecoilState(caregiversInfoState);
  const [formFields, setFormFields] = React.useState((cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== undefined &&
    cookies.careInsightsPassword !== '' &&
    cookies.careInsightsUsername !== '') ?
    {
      email: cookies.careInsightsUsername,
      password: cookies.careInsightsPassword
    } :
    defaultFormFields);
  const [careRecipientInfo, setCareRecipientInfo] = useRecoilState(
    careRecipientsInfoState
  );
  const [searchURL, setSearchURL] = useRecoilState(searchState);
  const [loading, setLoading] = useRecoilState(onOpenLoadingState);

  const loadAllData = async () => {
    if (currentUser !== null || (formFields.password !== '' && formFields.email !== '')) {
      // console.log('current user', currentUser, formFields);
      let email = formFields.email;
      if (currentUser !== null) {
        // console.log('update cache', currentUser);
        updateCache(currentUser);
        email = currentUser.email;
      }
      if (cookies.careInsightsPassword == '' && cookies.careInsightsUsername == '') {
        setFormFields(defaultFormFields);
      }
      setLoading(true);
      await loadCareRecipientsInfo(
        pageState,
        setPageState,
        setCareRecipientInfo,
        email,
        formFields.password,
        setExtendedAttributes,
        'app1'
      );
      setLoading(false);
    } else {
      // console.log('Did not load all data', currentUser, formFields);
    }
  }

  const forceReload = async () => {
    const newPageState = {
      ...pageState,
      selectedCR: 'NONE'
    };
    setPageState(newPageState);

    setLoading(true);
    await loadCareRecipientsInfo(
      newPageState,
      setPageState,
      setCareRecipientInfo,
      formFields.email,
      formFields.password,
      setExtendedAttributes,
      'app2'
    );
    setLoading(false);
  }

  const LoadingElem = () => {
    const [timer, setTimer] = React.useState(false);
    setTimeout(() => {
      setTimer(true);
    }, 3000);
    return (<>
      <h1>Processing data on care recipients...</h1>
      <CircularProgress />
      {!timer ? <></> :
        <>
          <h3>Troubleshooting help:</h3>
          This should take less than ten seconds, but sometimes our AI system hits a snag here and needs to be restarted.
          Thank you for your understanding, this is a new prototype.

          If are reading this, we may need your help to restart the system. Please try the following in order:
          1: Try <Button onClick={forceReload}>clicking here</Button> and wait for about five seconds.
          2: Try reloading the page.
          3: If you continue to have a problem, please sign out using the red button on the top right and sign back in.

          We are really sorry for the inconvenience. We're working to get this fixed.
        </>}
    </>);
  }

  useEffect(() => {
    async function fetch() {
      await loadAllData();
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
                <LoadingElem />
              </UserShell> : <SummaryInsights />}
            </RequireAuth>
          }
        />

        <Route
          path='/info'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <LoadingElem />
              </UserShell> : <CareInsightsPage />}
            </RequireAuth>
          }
        />

        <Route
          path='/questions'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <LoadingElem />
              </UserShell> : <SummaryInsights />}
            </RequireAuth>
          }
        />
        <Route
          path='/program-events'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <LoadingElem />
              </UserShell> : <VideoAnalysis />}
            </RequireAuth>
          }
        />

        <Route
          path='/support'
          element={
            <RequireAuth>
              {loading ? <UserShell>
                <LoadingElem />
              </UserShell> : <SupportPage />}
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

        <Route
          path='/reels'
          element={
            <RequireAuth>
              <ReelsPage />
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
