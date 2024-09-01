import React, { ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import '@mdxeditor/editor/style.css';
import '@tailwindcss/typography';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  listsPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, Typography } from '@mui/material';
import Markdown from 'react-markdown'
import { useLocation } from 'react-router-dom';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { careRecipientsInfoState, expandedProgramRowState, feedbackModalState, pageContextState } from '../../../state/recoil';
import { Button, ButtonGroup, Group, Text, Stack, SegmentedControl } from "@mantine/core"
import { GenericJsxEditor, JsxComponentDescriptor, NestedLexicalEditor, insertJsx$, jsxPlugin, usePublisher } from "@mdxeditor/editor"
import { MenuButton } from "../../../components/UserShell"
import { MessageCircleQuestion, MessageSquareText, SquarePlay } from "lucide-react"
import { replaceKeyInURI } from "../../videoAnalysis/programEventsTable/StreamGraph/utils"
import { CRProgramEvents, FeedbackContent, FeedbackEventTypes, FeedbackModifier, LikertScale, ProgramEventIndex, Reviews } from '../../../state/types';
import { DEEP_LINKS_TO_PROGRAM_EVENTS_FLAG } from '../../../state/globals';
import { filter } from 'd3';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { QueryRecord } from '../../../state/queryingTypes';
import { sampleAvoidQuery, sampleDoQuery, sampleRedirectQuery, sampleSymptomsQuery } from '../../../state/fetching';
import { AuthContext } from '../../../state/context/auth-context';
import { reportTrackingEvent } from '../../../state/tracking';

const inputStyles = {
  'width': '100%',
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

// const jsxComponentDescriptors: JsxComponentDescriptor[] = [
//   {
//     name: 'GoTo',
//     kind: 'flow',
//     source: './external',
//     props: [{ name: 'label', type: 'string' }, { name: 'queryString', type: 'string' }],
//     hasChildren: true,
//     Editor: (n) => {
//       // const query = n.mdastNode.attributes.filter((v) => (v as any).name === 'query')[0].value as string;
//       const queryString = n.mdastNode.attributes.filter((v) => (v as any).name === 'queryString')[0].value as string;
//       const label = n.mdastNode.attributes.filter((v) => (v as any).name === 'label')[0].value as string;
//       // const newUri = new URL(replaceKeyInURI(location.href, 'q', query));
//       // const search = newUri.searchParams.toString();
//       return (<li><Group>{label}<MenuButton queryString={queryString} path='/questions' icon={<MessageCircleQuestion color='blue' size={18} />}><i style={{ color: 'blue' }}>Details</i></MenuButton></Group></li>);
//     }
//   }
// ];

type GoToProps = {
  label: string,
  queryString: string
  type: FeedbackEventTypes,
  query: QueryRecord,
  hideFeedback: boolean,
  setFeedbackModule: SetterOrUpdater<false | FeedbackContent>
  longform: boolean
}

const GoTo: React.FC<GoToProps> = ({ label, queryString, type, query, setFeedbackModule, longform, hideFeedback }) => {
  const pageState = useRecoilValue(pageContextState);
  return (<li><Group>{addCitations(label, pageState.selectedCRProgramEvents, type, query, setFeedbackModule, hideFeedback, longform)}
    <MenuButton queryString={queryString} path='/questions'
      icon={<MessageCircleQuestion color='blue' size={18} />}>
      <i style={{ color: 'blue' }}>Details</i>
    </MenuButton>
  </Group></li>);
}

type CiteProps = {
  p: ProgramEventIndex | undefined
}

const Cite: React.FC<CiteProps> = ({ p }) => {
  if (p === undefined) {
    return <></>;
  }
  const icon = p.videoTimestamp === undefined ? <MessageSquareText color='blue' size={18} /> : <SquarePlay color='blue' size={18} />;
  return (
    <MenuButton path='/program-events' programEventIndex={p}
      icon={icon}>
      <></>
      {/* <i style={{ color: 'blue' }}></i> */}
    </MenuButton>);
}

// import { uploadFile } from '../../../state/setting';

async function imageUploadHandler(image: File) {
  // uploadFile(image, '/uploads/new');
  return 'test';
}

type WYSIWYGEditorProps = {
  readOnly: boolean;
  onChange: (markdown: string) => void;
  markdown: string;
  loading: boolean;
  showDefaultMessage: boolean;
  defaultMessage: string;
  update: boolean;
  updateCallback: (forceUpdate: React.DispatchWithoutAction) => void;
  longform: boolean;
  query: QueryRecord;
  hideFeedback: boolean;
  updateRating: (key: keyof Reviews, value: LikertScale | undefined) => void
};

const cleanLink = (t: string) => t.replaceAll('\\cite{', '').replaceAll('}', '').trim();

const wrapAsLink = (text: string, pathname: string, currentCR: string, type: FeedbackEventTypes,
  query: QueryRecord,
  setFeedbackModule: SetterOrUpdater<false | FeedbackContent>, hideFeedback: boolean, longform: boolean) => {
  const newLineSplitText = text.split(/\n/);
  // const baseURLLocal = 'https://main--care-insights.netlify.app/'; //http://localhost:3000/';
  // const path = 'questions'
  const promptPreface = 'Give me more detailed feedback about: ';

  const prompt = (t: string) => promptPreface + t;
  // const wrappedBullets = newLineSplitText.map((t) => `[${t}](${baseURLLocal}${path}?cr="${currentCR}"&q="${prompt(t)}")`);
  const wrappedBullets = newLineSplitText.map((t, i) => <ul key={t + i}><GoTo setFeedbackModule={setFeedbackModule} longform={longform} query={query} hideFeedback={hideFeedback}
    type={type} queryString={promptPreface + t} label={t} /></ul>);
  return wrappedBullets;
}

const getIndex: (id: string, programEvents: CRProgramEvents) => ProgramEventIndex | undefined = (idUnstripped, programEvents) => {
  const id = idUnstripped.replaceAll(',', '').replaceAll('\\cite{', '').replaceAll('}', '')
  const res = Object.values(programEvents).flatMap((p) => {
    if (p.uuid === id) {
      return {
        programEventId: id,
      };
    } else {
      if (p.type === 'manual-entry-event' || p.type === 'avoid-feedback' ||
        p.type === 'details-feedback' || p.type === 'do-feedback' ||
        p.type === 'redirection-feedback' || p.type === 'symptom-feedback'
      ) {
        return null;
      } else {
        if (p.type === 'music-event') {
          return Object.values(p.meaningfulMoments).flatMap((m) => {
            if (m.uuid === id) {
              return ({
                programEventId: p.uuid,
                videoTimestamp: m.startTime,
              });
            } else {
              return null;
            }
          });
        } else {
          return null;
        }
      }
    }
  });
  const filtered = res.filter((v) => v !== null);
  if (filtered.length > 0) {
    return filtered[0] as ProgramEventIndex;
  } else {
    return undefined;
  }
}

type Ordering = {
  order: number,
  value: string,
  segments: string[]
}

type KeyPosition = {
  key: string,
  order: number,
  textAfter: string,
  textBefore: string,
}

const splitTextIntoSegments = (text: string, keys: string[]) => {
  let ordering: Ordering[] = [];
  let remainingText = text;
  const findNextKey: (t: KeyPosition) => KeyPosition | undefined = (t) => {
    const keysMapped = keys.map((k) => {
      const index = t.textAfter.indexOf(k);
      if (index === -1) {
        return null;
      }
      return ({
        order: index,
        key: k,
        textAfter: t.textAfter.slice(index + k.length),
        textBefore: t.textAfter.slice(0, index),
      });
    }).filter((a) => a !== null) as KeyPosition[];
    // console.log('keys mapped ', keysMapped, 'reference ', text);
    if (keysMapped.length === 0) {
      console.log('no keys found!');
      return undefined;
    } else {
      const f = keysMapped.sort((a, b) => a.order - b.order)[0];
      return f;
      // console.log('sorted values: ', f, 'reference: ', text);
    }
  };
  const firstKey: KeyPosition = {
    key: '',
    order: 0,
    textAfter: text,
    textBefore: ''
  }
  let result: KeyPosition[] = [firstKey];
  let nextKey: KeyPosition | undefined = firstKey;
  while (nextKey != undefined) {
    nextKey = findNextKey(nextKey);
    if (nextKey === undefined) {
      console.log('next key is empty');
      break;
    }
    console.log('next key is ', nextKey);
    result = [...result, nextKey];
  }
  console.log('final result is', result);
  return result;
};
// while ()
// keys.forEach((k, i) => {
//   const prior = i > 0 && ordering.length > i - 1 && ordering[i - 1].segments.length > 1 ? ordering[i - 1].segments[1] : text;
//   ordering = [...ordering, { order: text.indexOf(k), value: k, segments: prior.split(k) }];
// });
// if (ordering.map((v) => v.order).includes(-1)) {
//   return [{
//     order: 1,
//     value: '',
//     segments: [text, '']
//   }];
// }
// const t = ordering.sort((a, b) => a.order - b.order);
// t.map((k, i) => {
//   if (k.segments.length <= 1) {
//     return k;
//   }
//   let prior: = [];
//   let j = 0;
//   while (i < p)
//   ordering = [...ordering, { order: text.indexOf(k), value: k, segments: prior.split(k) }];
// });
// return t;
// }

export const DEFAULT_BECAUSE_VALUE = 'Because: '
// export const formatFeedback = async (input: string, type: FeedbackEventTypes, query: string, modifier: FeedbackModifier, because: string) => {
//   const becauseSuffix = because !== DEFAULT_BECAUSE_VALUE ? because : '';
//   const template = (() => {switch (type) {
//     case 'avoid-feedback':
//       return `An outdated care note "${input}" is ${modifier} to notes on "things that a caregiver should avoid doing." ${becauseSuffix}`;
//     case 'do-feedback':
//       return `An outdated care note "${input}" is ${modifier} to notes on "things that a caregiver should focus on doing." ${becauseSuffix}`;
//     case 'redirection-feedback':
//       return `An outdated care note "${input}" is ${modifier} to notes on "ways that a caregiver can redirect the care recipient." ${becauseSuffix}`;
//     case 'symptom-feedback':
//       return `An outdated care note "${input}" is ${modifier} to notes on "symptoms that the care recipient shows" ${becauseSuffix}`;
//     case 'details-feedback':
//       return `An outdated care note "${input}" is ${modifier} to the question "${query}". ${becauseSuffix}`;
//   }})();
//   if (type === 'details-feedback') {
//     return await sythesizeFeedback(template);
//   }
//   return template;
// }
export const CITATION_REGEX = /\\cite{[^}]*}/g;
export const cleanStringOfCitations = (dirtyString: string) => dirtyString.replace(CITATION_REGEX, '');

const addCitations = (text: string, programEvents: CRProgramEvents, type: FeedbackEventTypes,
  query: QueryRecord, setFeedbackModule: SetterOrUpdater<false | FeedbackContent>, hideFeedback: boolean, longform: boolean) => {

  const m = (r: RegExp) => {
    const res = text.match(CITATION_REGEX);
    if (res === null) {
      return [];
    }
    return res;
  }
  const found = [...m(CITATION_REGEX)];
  const references: ProgramEventIndex[] = found.map((v) => getIndex(v, programEvents)).filter((v) => v !== undefined) as ProgramEventIndex[];
  const wrapped = (t: string, v: string | ReactNode) => {
    if (hideFeedback || (!longform && found.length > 0)) {
      return v;
    } else {
      return (<span>{v}<Group><Button
        leftSection={<IconThumbUp className='text-green-600/75' />}
        onClick={async () => {
          setFeedbackModule({
            targetContent: t,
            modifier: 'useful',
            feedback: '', //await formatFeedback(t, type, query.query, 'useful', ''),
            query: query,
            feedbackType: type,
            references,
          });
        }}
        variant='outline'
        className='text-green-600/75 hover:text-green-600/75 border-green-600/75'
        size='xs'
      >
        Useful?
      </Button><Button
        leftSection={<IconThumbDown className='text-red-600/75' />}
        onClick={async () => {
          setFeedbackModule({
            targetContent: t,
            modifier: 'not accurate',
            feedback: '',//await formatFeedback(t, type, query.query, 'not relevant', ''),
            query: query,
            feedbackType: type,
            references,
          });
        }}
        variant='outline'
        className='text-red-600/75 hover:text-red-600/75 border-red-600/75'
        size='xs'
      >
          Incorrect?
        </Button></Group></span>);
    }
  };
  // const getSegment = (input: string[], final: boolean) => {
  //   // let returnIndex = Math.max(0, input.length - 2);
  //   // if (final) {
  //   //   returnIndex = input.length - 1;
  //   // }
  //   return input[returnIndex]; // TODO look more at this later.
  // const wrap = input.split('\n').length > 1;
  // if (wrap) {
  //   return wrapped(input);
  // } else {
  //   return input;
  // }
  if (found.length === 0) {
    if (hideFeedback) {
      return text;
    } else {
      return wrapped(text, text);
    }
  }
  console.log('results ', found, splitTextIntoSegments(text, found), 'original text: ', text);
  return (wrapped(text, <div> {
    splitTextIntoSegments(text, found).map((v, i) => {
      const index = getIndex(v.key, programEvents);
      return <span key={index?.programEventId + '-' + i}><span>{v.textBefore}</span><Cite p={index} /></span>;
    })}
  </div>));
};


const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  readOnly,
  showDefaultMessage,
  onChange,
  update,
  updateCallback,
  defaultMessage,
  loading,
  markdown,
  longform,
  query,
  hideFeedback,
  updateRating,
}) => {
  // NOTE: All this force updating is required to get the MDX
  // editor to load the proper content.
  // it's hacky, and could lead to bugs, but seems to be necessary.
  // If there are problems with this, try replacing mdx or using the
  // ref hook.
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const { pathname } = useLocation();
  const { currentUser } = useContext(AuthContext);
  const pageState = useRecoilValue(pageContextState);
  const [_, setFeedbackModal] = useRecoilState(feedbackModalState);
  const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);
  const CRName = careRecipientsInfo[pageState.selectedCR] ? careRecipientsInfo[pageState.selectedCR].name : 'NONE';
  const includeRating = !location.search.includes('review=false');
  const scale: { label: LikertScale, value: LikertScale }[] = [
    { label: 'Strongly disagree', value: 'Strongly disagree' },
    { label: 'Disagree', value: 'Disagree' },
    { label: 'Agree', value: 'Agree' },
    { label: 'Strongly agree', value: 'Strongly agree' },
    { label: 'N/A', value: 'N/A' },
  ];

  const getColor = (key: LikertScale) => {
    switch (key) {
      case 'Agree':
        return 'green';
      case 'Strongly agree':
        return 'darkGreen';
      case 'Disagree':
        return 'red';
      case 'Strongly disagree':
        return 'darkRed'
      default:
        return 'grey';
    }
  }
  const getRating: () => Reviews = () => {
    if (query.reviews === undefined) {
      return {
        'infoIsActionable': 'N/A',
        'infoIsCorrect': 'N/A',
        'infoIsMissing': 'N/A',
      }
    } else {
      if (query.reviews[currentUser?.email as string] === undefined) {
        return {
          'infoIsActionable': 'N/A',
          'infoIsCorrect': 'N/A',
          'infoIsMissing': 'N/A',
        }
      } else {
        return query.reviews[currentUser?.email as string];
      }
    }
  }
  const [rating, setRating] = useState<Reviews>(getRating());
  // useEffect(() => {
  //   setRating(getRating());
  // }, [query]);
  const ratingControls = <>
    {includeRating ? <Stack style={{backgroundColor: '#F1F1F1', borderRadius: 25,color: 'darkBlue', padding: 20}}>
      <div >
        <Text size="sm" fw={500} mb={3}>
        The summary is accurate.
        </Text>
        <SegmentedControl
          color={getColor(rating.infoIsCorrect)}
          value={rating.infoIsCorrect}
          onChange={(value) => {
            updateRating('infoIsCorrect', value as LikertScale);
            if (value !== undefined) {
              setRating({
                ...rating,
                'infoIsCorrect': value as LikertScale,
              });
            }
          }}
          data={scale}
        />
      </div>
      <div>
        <Text size="sm" fw={500} mb={3}>
        The summary includes the most important information.
        </Text>
        <SegmentedControl
          color={getColor(rating.infoIsMissing)}
          value={rating.infoIsMissing}
          onChange={(value) => {
            updateRating('infoIsMissing', value as LikertScale);
            if (value !== undefined) {
              setRating({
                ...rating,
                'infoIsMissing': value as LikertScale,
              });
            }
          }}
          data={scale}
        />
      </div>
      <div>
        <Text size="sm" fw={500} mb={3}>
        The summary is concise and actionable.
        </Text>
        <SegmentedControl
          color={getColor(rating.infoIsActionable)}
          value={rating.infoIsActionable}
          onChange={(value) => {
            updateRating('infoIsActionable', value as LikertScale);
            if (value !== undefined) {
              setRating({
                ...rating,
                'infoIsActionable': value as LikertScale,
              });
            }
          }}
          data={scale}
        />
      </div>
    </Stack> : <></>}</>;

  const getFeedbackType: (query: QueryRecord) => FeedbackEventTypes = (query) => {
    switch (query.query) {
      case sampleAvoidQuery(CRName): {
        return 'avoid-feedback';
      }
      case sampleDoQuery(CRName): {
        return 'do-feedback';
      }
      case sampleSymptomsQuery(CRName): {
        return 'symptom-feedback';
      }
      case sampleRedirectQuery(CRName): {
        return 'redirection-feedback';
      } default: {
        return 'details-feedback'
      }
    }
  };
  if (update) {
    updateCallback(forceUpdate);
  }
  if (loading) {
    return <CircularProgress />;
  }
  if (showDefaultMessage) {
    return <Typography variant='body2'>{defaultMessage}</Typography>;
  }
  if (readOnly) {
    if (longform) {
      if (DEEP_LINKS_TO_PROGRAM_EVENTS_FLAG) {
        return <>
          {addCitations(markdown, pageState.selectedCRProgramEvents, getFeedbackType(query), query, setFeedbackModal, false, longform)}
          {ratingControls}
        </>;
      } else {
        return markdown;
      }
    } else {
      return (
        <>
          {wrapAsLink(markdown, pathname, pageState.selectedCR, getFeedbackType(query), query, setFeedbackModal, false, longform)}
          {ratingControls}
        </>
      );
    }
  }
  return (
    <div>
      <div className='z-10'>
        <TextField
          id='outlined-basic'
          multiline
          value={markdown}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            onChange(event.target.value);
          }}
          sx={inputStyles}
        />
      </div>
      {ratingControls}
    </div>
  );
};

export default WYSIWYGEditor;
