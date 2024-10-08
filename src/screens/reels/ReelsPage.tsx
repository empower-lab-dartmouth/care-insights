import React, { useContext, useEffect, useState } from 'react';
import UserShell, { MenuButton } from '../../components/UserShell';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { ErrorBoundary } from 'react-error-boundary';
import ReactPlayer from 'react-player';
import { Button, MultiSelect, Pagination } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconEyeOff, IconRestore, IconTrashX } from '@tabler/icons-react';
import { Group, InfoIcon } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { pageContextState } from '../../state/recoil';
import { MomentType, MusicProgramEvent, Reel, SelectorValue } from '../../state/types';
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

type FilterValues = MomentType | 'programEvent' | 'song'

const ReelsPage = () => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const options: SelectorValue<FilterValues>[] = [
    {
      label: 'Redirection',
      value: 'redirection',
    },
    {
      label: 'Positive response to music',
      value: 'positiveMusic',
    },
    {
      label: 'Memory recall',
      value: 'memoryRecall',
    },
    {
      label: 'Note',
      value: 'note',
    },
    {
      label: 'Frustration',
      value: 'frustration',
    },
    {
      label: 'Song',
      value: 'song',
    },
    {
      label: 'Program Event',
      value: 'programEvent',
    },
  ];
  const allOptions = options.map((o) => o.value);
  const [filterValues, setFilterValues] = useState<FilterValues[]>(allOptions);
  const [meaningfulMoments, setMeaningfulMoments] = useState<Reel[]>([]);
  const calcMeaningfulMoments = () => Object.values(pageContext.selectedCRProgramEvents)
    .filter((v) => v.type == 'music-event')
    .flatMap((v) => {
      if (v.type === 'music-event') {
        return Object.values(v.meaningfulMoments).filter(
          (m) => (m.removedFromReels === undefined || m.removedFromReels === false)
            && v.videoUrl !== 'video-missing'
            && filterValues.indexOf(m.type) !== -1
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
  useEffect(() => setMeaningfulMoments(calcMeaningfulMoments()), [filterValues, pageContext]);
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
        <Button variant="light"
          onClick={(e) => setFilterValues(allOptions)}>Select all</Button>
        <MultiSelect
          label="Include reels:"
          placeholder="Select one or more"
          data={options}
          value={filterValues}
          onChange={(v) => setFilterValues(v as FilterValues[])}
          clearable
        />
        {meaningfulMoments.length === 0 ?
          <h1>No reels</h1> :
          <>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}>
              {meaningfulMoments[momentIndex] === undefined ? <></> :
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
                  url={meaningfulMoments[momentIndex].videoSrc} />}
            </ErrorBoundary>

            <Button
              variant="light"
              leftSection={<IconEyeOff size={14} />}
              onClick={(e) => {
                const priorIndex = momentIndex;
                if (momentIndex > 0) {
                  setMomentIndex(momentIndex - 1);
                };
                console.log('hide reel' + priorIndex);
                const newEvent = pageContext.selectedCRProgramEvents[meaningfulMoments[priorIndex].programEventID] as MusicProgramEvent;
                setPageContext({
                  ...pageContext,
                  selectedCRProgramEvents: {
                    ...pageContext.selectedCRProgramEvents,
                    [meaningfulMoments[priorIndex].programEventID]: {
                      ...newEvent,
                      meaningfulMoments: {
                        ...newEvent.meaningfulMoments,
                        [meaningfulMoments[priorIndex].uuid]: {
                          ...newEvent.meaningfulMoments[meaningfulMoments[priorIndex].uuid],
                          removedFromReels: true
                        }
                      }
                    }
                  }
                });
                setMeaningfulMoments(calcMeaningfulMoments());
              }
              }
            >
              Hide this reel
            </Button>
            {/* <Button
              variant="light"
              leftSection={<InfoIcon size={14} />}
            > */}
            {/* More info */}
            {/* </Button> */}
            <br />
            <br />
            <Pagination style={{ width: '100%' }} value={momentIndex} onChange={(n) => {
              setMomentIndex(n);
              seekTo(meaningfulMoments[n].startTime / 1000);
            }} total={meaningfulMoments.length - 1} />
            <h4>{meaningfulMoments[momentIndex].description}</h4>
            <MenuButton path='/program-events' programEventIndex={
              {
                programEventId: meaningfulMoments[momentIndex].programEventID,
                videoTimestamp: meaningfulMoments[momentIndex].startTime
              }}
              icon={<h4 style={{ color: 'blue' }}>More Info...</h4>}>
              <></>
              {/* <i style={{ color: 'blue' }}></i> */}
            </MenuButton>
            <br />
            <br />
            <Button
              variant="light"
              leftSection={<IconRestore size={14} />}
              onClick={(e) => { seekTo(meaningfulMoments[momentIndex].startTime / 1000); }}
            >
              Reset
            </Button>
          </>}
      </>
    </UserShell >
  );
};

export default ReelsPage;
