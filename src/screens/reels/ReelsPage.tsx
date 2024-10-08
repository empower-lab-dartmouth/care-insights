import React, { useContext, useEffect, useState } from 'react';
import UserShell from '../../components/UserShell';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { ErrorBoundary } from 'react-error-boundary';
import ReactPlayer from 'react-player';
import { Button, Pagination } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconTrashX } from '@tabler/icons-react';
import { InfoIcon } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { pageContextState } from '../../state/recoil';
import { Reel } from '../../state/types';
import { mean } from 'd3';

const videoURL = 'https://www.youtube.com/watch?v=s3G2kLruJJo';

const ErrorFallback: React.FC<any> =
  ({ error }) => (
    <div role="alert">
      <h2>
        Video could not load. Try again later.
      </h2>
    </div>
  );

const ReelsPage = () => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const meaningfulMoments: Reel[] = Object.values(pageContext.selectedCRProgramEvents)
    .filter((v) => v.type == 'music-event')
    .flatMap((v) => {
      if (v.type === 'music-event') {
        return Object.values(v.meaningfulMoments).filter(
          (m) => m.removedFromReels === undefined || m.removedFromReels
          && v.videoUrl !== 'video-missing'
        ).map((m) =>
        ({
          startTime: m.startTime,
          uuid: m.uuid,
          description: m.description,
          type: m.type,
          videoSrc: v.videoUrl,
          programEventID: v.uuid,
        }));
      } else {
        return [];
      }
    });
  const [momentIndex, setMomentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const forwardedRef = React.useRef<ReactPlayer>(null);
  const seekTo = (x: number) => {
    forwardedRef.current?.seekTo(x);
  }
  const [isReady, setIsReady] = React.useState(false);
  const onReady = React.useCallback(() => {
    if (!isReady) {
      if (forwardedRef.current !== null) {
        const timeToStart = meaningfulMoments[momentIndex].startTime / 1000;
        // if (timeToStart !== 0) {
        forwardedRef.current.seekTo(timeToStart, "seconds");
        // }
        setIsReady(true);
      }
    }
  }, [isReady]);

  return (
    <UserShell>
      <CommonCRActions page={'reels'} />
      <>
        {meaningfulMoments.length === 0 ?
          <h1>No reels</h1> :
          <>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}>
              <ReactPlayer
                ref={forwardedRef}
                onReady={onReady}
                onProgress={({
                  played,
                  playedSeconds,
                  loaded,
                  loadedSeconds,
                }) => {
                  setProgress(played);
                  // setPlayedSeconds(playedSeconds);
                }}
                onStart={() => { }}
                // setProgress(played);
                // setVideoStarted(true)} 
                controls={true}
                url={meaningfulMoments[momentIndex].videoSrc} />
            </ErrorBoundary>
            <Button
              variant="light"
              leftSection={<IconTrashX size={14} />}
            >
              Remove reel
            </Button>
            <Button
              variant="light"
              leftSection={<InfoIcon size={14} />}
            >
              More info
            </Button>
            <br />
            <Pagination value={momentIndex} onChange={(n) => {
              setMomentIndex(n);
              seekTo(meaningfulMoments[n].startTime / 1000);
            }} total={meaningfulMoments.length - 1} />
            <h4>{progress}</h4>
            <h4>{meaningfulMoments[momentIndex].startTime}</h4>
          </>}
      </>
    </UserShell >
  );
};

export default ReelsPage;
