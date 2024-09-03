import { AppShell, Avatar, UnstyledButton, Text, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';

import { FileQuestion, SquarePlay, UsersRound, Info, MessageCircleQuestion, NotepadText } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../state/context/auth-context';
import { IconLogout, IconMenu2, IconQuestionMark, IconX } from '@tabler/icons-react';
import { useCookies } from 'react-cookie';
import SessionTracker from '../Tracker';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, expandedProgramRowState, extededAttributesState, hideFeedbackState, pageContextState, queriesForCurrentCGState } from '../state/recoil';
import { QueryRecord } from '../state/queryingTypes';
import { askQuery } from '../state/querying';
import { setCareRecipientInfo, setRemoteQueryRecord } from '../state/setting';
import { resetAuthCache } from '../state/globals';
import { reportTrackingEvent } from '../state/tracking';
import Demo from '../state/LocationTracking';
import { loadCRData } from '../state/fetching';
import { ProgramEventIndex } from '../state/types';



export const MenuButton = ({
  children,
  path,
  icon,
  programEventIndex,
  queryString,
  search: s,
}: {
  children: React.ReactNode;
  path: string;
  icon: React.ReactNode;
  programEventIndex?: ProgramEventIndex;
  queryString?: string;
  search?: string;
}) => {
  const [_, setProgramEventIndex] = useRecoilState(expandedProgramRowState)
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const { currentUser } = useContext(AuthContext);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [editingQuery, setEditingQuery] = useState(
    pageContext.insightsQuery.query
  );
  const extendedAttributes = useRecoilValue(extededAttributesState);
  const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);
  const CRName = careRecipientsInfo[pageContext.selectedCR] ? careRecipientsInfo[pageContext.selectedCR].name : 'Care recipient';
  const displayName = extendedAttributes[pageContext.selectedCR] ? extendedAttributes[pageContext.selectedCR].firstName + ' ' + extendedAttributes[pageContext.selectedCR].lastName : CRName;
  const handleLocalQueryResponse = (q: QueryRecord) => {
    setQueries({
      ...queries,
      [q.query]: q,
    });
    setPageContext({
      ...pageContext,
      insightsQuery: q,
    });
    setEditingQuery(q.query);
  };
  const makeQuery = async (q: string) => {
    setPageContext({
      ...pageContext,
      loadingCRInfo: true,
    });
    const programEvents = Object.values(pageContext.selectedCRProgramEvents).length === 0 ? await loadCRData(
      pageContext,
      setPageContext,
      setQueries,
      careRecipientsInfo,
      extendedAttributes[pageContext.selectedCR],
      true,
    ) : pageContext.selectedCRProgramEvents;
    const query = await askQuery(
      q,
      handleLocalQueryResponse,
      programEvents,
      currentUser?.email as string,
      pageContext.selectedCR,
      queries,
      false,
      displayName,
      extendedAttributes[pageContext.selectedCR],
      true
    );
    setRemoteQueryRecord(query);
    // console.log('the queries are', queries, "our query is: ", query);
    setQueries({
      ...queries,
      [query.query]: query,
    });
    setPageContext({
      ...pageContext,
      selectedCRProgramEvents: programEvents,
      loadingCRInfo: false,
      insightsQuery: query,
    });
  };

  const { pathname, search: s2 } = useLocation();
  const search = s ? s : s2;
  return (
    <Link to={{ pathname: path, search }} onClick={() => {
      if (programEventIndex !== undefined) {
        reportTrackingEvent({
          type: 'citation',
          index: programEventIndex
        }, currentUser?.email as string, pageContext);
        setProgramEventIndex(programEventIndex);
      }
      if (queryString !== undefined) {
        reportTrackingEvent({
          type: `clicked-details`,
          query: queryString
        }, currentUser?.email as string, pageContext);
        makeQuery(queryString);
      }
    }}>
      <UnstyledButton
        className={programEventIndex === undefined ? `px-2 py-3 hover:bg-slate-100 rounded-md w-full flex items-center gap-2 text-sm` : `px-2 py-3 hover:bg-slate-100 rounded-md items-center gap-2 text-sm`}
        style={{
          backgroundColor: pathname === path ? '#e7f5ff' : 'transparent',
          color: pathname === path ? 'black' : 'white',
          fontWeight: pathname === path ? 'bold' : '500',
        }}
      >
        {icon}
        <div>{children}</div>
      </UnstyledButton>
    </Link>
  );
};

const MenuButtons = () => {
  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex flex-col gap-2'>
        <SessionTracker />
        <MenuButton path='/info' icon={<NotepadText size={18} />}>
          Snapshot
        </MenuButton>
        <MenuButton path='/questions' icon={<MessageCircleQuestion size={18} />}>
          Details
        </MenuButton>
        <MenuButton path='/program-events' icon={<SquarePlay size={18} />}>
          Program events
        </MenuButton>
        <MenuButton path='/support' icon={<Info size={18} />}>
          Onboarding
        </MenuButton>
        {/* <MenuButton path='/care-team' icon={<UsersRound size={18} />}>
          Care Team
        </MenuButton> */}
      </div>
    </div>
  );
};

const formatUsername = (input: string | null | undefined) => {
  if (input == undefined || input == null) {
    return ''
  }
  if (input.indexOf('@') != -1) {
    return input.split('@')[0].replace('@memcara.com', '').replace('-at-', '@');
  } else {
    return input;
  }
}

const UserShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { currentUser, signOut } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(['careInsightsUsername', 'careInsightsPassword']);
  const [_, setCRs] = useRecoilState(careRecipientsInfoState);
  const [extendedAttributes, setExtendedAttributes] = useRecoilState(extededAttributesState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const [hideFeedback, setHideFeedback] = useRecoilState(hideFeedbackState);


  return (
    <div>
      <AppShell
        header={{
          height: 50,
        }}
        navbar={{
          width: 220,
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
        padding='md'
      >
        <AppShell.Header>
          <div className='flex justify-between items-center h-full px-3'>
            <div className='flex gap-2 items-center'>
              <UnstyledButton className='flex lg:hidden' onClick={toggle}>
                {opened ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </UnstyledButton>
              <div className='hidden lg:flex gap-2 items-center'>
                <img src='logo-circle.svg' />
                <h1 id='logo'>Care Insights</h1>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                labelPosition="left"
                label="Hide feedback"
                checked={hideFeedback}
                onChange={(event) => setHideFeedback(event.currentTarget.checked)}
              />
              <Text>{formatUsername(currentUser?.email)}</Text>
              <Avatar radius='xl' size='md' color='blue'>
                {currentUser?.email ? currentUser.email[0].toUpperCase() : ''}
              </Avatar>
              <UnstyledButton color='red' onClick={() => {
                setCookie('careInsightsUsername', '');
                setCookie('careInsightsPassword', '');
                setCRs({});
                setExtendedAttributes({});
                resetAuthCache();
                setTimeout(() => {
                  setCookie('careInsightsUsername', '');
                  setCookie('careInsightsPassword', '');
                  setCRs({});
                  setExtendedAttributes({});
                  resetAuthCache();
                  setPageContext({
                    ...pageContext,
                    selectedCR: 'NONE',
                    selectedCRProgramEvents: {},
                  });
                  signOut();
                }, 400);
              }}>
                <IconLogout size={24} color='	#db2b29' />
              </UnstyledButton>
            </div>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p='sm' className='bg-primary z-inherit z-1 xl:z-0'>
          <MenuButtons />
        </AppShell.Navbar>

        <AppShell.Main className=' bg-gray-50'>
          <div className='px-8 z-10'>{children}</div>
        </AppShell.Main>
      </AppShell>
    </div>
  );
};

export default UserShell;
