import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchOnOpen, loadPageDataFromFB } from '../fetching';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, extededAttributesState, onOpenLoadingState, onSiteState, pageContextState, queriesForCurrentCGState, searchState } from '../recoil';
import { useGeolocated } from "react-geolocated";
import { PERMISSIBLE_LOCATIONS } from '../types';
import haversine from 'haversine-distance'
import { Button } from '@mantine/core';


const withinDistance = (latitude: number, longitude: number) => {
  return PERMISSIBLE_LOCATIONS.map((l) => {
    return haversine({ latitude, longitude }, { latitude: l.latitude, longitude: l.longitude }) < l.radius
  }).reduce((a, b) => a || b);
}

function RequireAuthLocations({ children }: { children: JSX.Element }) {
  const { search } = useLocation();
  const [_, setOnSite] = useRecoilState(onSiteState);
  if (search.includes('dev=true')) {
    console.log('loading a location required site in dev mode.');
    return children;
  }
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (coords) {
      setOnSite({
        onSite: withinDistance(coords.latitude, coords.longitude),
      latitude: coords.latitude, longitude: coords.longitude});
    }
  }, [coords]);
  return <>
    {!isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation, please try using Chrome</div>
    ) : !isGeolocationEnabled ? (
      <div><h1>This site does not have access to your location data. </h1>You must be physically present at the facility to access care insights, so providing access to location data is required. <br />
        Please read the instrucitons here for <a href='https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting'><Button> more information for giving a web site access to your current location. </Button></a>
        Then, follow those steps while this page (i.e. <i>https://main--care-insights.netlify.app/</i>) is opened.
        If you need more information, believe you have reached this page because of an error, or need help, please email Christina from Memcara at christina@memcara.com right away and someone from our team will get back to you right away. Thank you! 
      </div>
    ) : coords ? (
      <>{

        withinDistance(coords.latitude, coords.longitude) ?
          <>{children}</> : <div>You must be physically at the facility to access care insights.&hellip; If you need more information or believe you have reached this page because of an error, please email Christina from Memcara at christina@memcara.com right away and our team will get back to you right away. Thank you! </div>}
      </>) : (
      <div>Checking your location data. You must be physically at the facility to access care insights.&hellip; </div>
    )}
  </>
}


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
        } else {
          // console.log('No need to load data', currentUser.email, pageState.insightsQuery.queryResponse);
        }
      }
    }

    fetch();
  }, [currentUser]);

  const displayName = currentUser?.displayName;
  // Check if we're dealing with a facility with location services required.
  if (displayName !== null && PERMISSIBLE_LOCATIONS.filter((v) => displayName?.includes(v.name)).length > 0) {
    return (<RequireAuthLocations>{children}</RequireAuthLocations>);
  }

  console.log('location data not required');
  return children;
}

export default RequireAuth;
