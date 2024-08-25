import React, { useReducer } from 'react';
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
import { useRecoilValue } from 'recoil';
import { pageContextState } from '../../../state/recoil';
import { Button, ButtonGroup, Group, Stack } from "@mantine/core"
import { GenericJsxEditor, JsxComponentDescriptor, NestedLexicalEditor, insertJsx$, jsxPlugin, usePublisher } from "@mdxeditor/editor"
import { MenuButton } from "../../../components/UserShell"
import { MessageCircleQuestion } from "lucide-react"
import { replaceKeyInURI } from "../../videoAnalysis/programEventsTable/StreamGraph/utils"
import { CRProgramEvents, ProgramEventIndex } from '../../../state/types';
import { DEEP_LINKS_TO_PROGRAM_EVENTS_FLAG } from '../../../state/globals';
import { filter } from 'd3';


const inputStyles = {
  'width': '100%',
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'GoTo',
    kind: 'flow',
    source: './external',
    props: [{ name: 'label', type: 'string' }, { name: 'queryString', type: 'string' }],
    hasChildren: true,
    Editor: (n) => {
      // const query = n.mdastNode.attributes.filter((v) => (v as any).name === 'query')[0].value as string;
      const queryString = n.mdastNode.attributes.filter((v) => (v as any).name === 'queryString')[0].value as string;
      const label = n.mdastNode.attributes.filter((v) => (v as any).name === 'label')[0].value as string;
      // const newUri = new URL(replaceKeyInURI(location.href, 'q', query));
      // const search = newUri.searchParams.toString();
      return (<li><Group>{label}<MenuButton queryString={queryString} path='/questions' icon={<MessageCircleQuestion color='blue' size={18} />}><i style={{ color: 'blue' }}>Details</i></MenuButton></Group></li>);
    }
  }
];

type GoToProps = {
  label: string,
  queryString: string
}


const GoTo: React.FC<GoToProps> = ({ label, queryString }) => {
  return (<li><Group>{label}
    <MenuButton queryString={queryString} path='/questions'
      icon={<MessageCircleQuestion color='blue' size={18} />}>
      <i style={{ color: 'blue' }}>Details</i>
    </MenuButton>
  </Group></li>);
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
};

const cleanLink = (t: string) => t.replaceAll('-', '').replaceAll('*', '').replaceAll(' ', '%20').trim();

const wrapAsLink = (text: string, pathname: string, currentCR: string) => {
  const newLineSplitText = text.split(/\n/);
  // const baseURLLocal = 'https://main--care-insights.netlify.app/'; //http://localhost:3000/';
  // const path = 'questions'
  const promptPreface = 'Give me more detailed feedback about: ';

  const prompt = (t: string) => promptPreface + t;
  // const wrappedBullets = newLineSplitText.map((t) => `[${t}](${baseURLLocal}${path}?cr="${currentCR}"&q="${prompt(t)}")`);
  const wrappedBullets = newLineSplitText.map((t, i) => <ul key={t + i}><GoTo queryString={promptPreface + t} label={t} /></ul>);
  return wrappedBullets;
}

const getIndex: (id: string, programEvents: CRProgramEvents) => ProgramEventIndex | undefined = (idUnstripped, programEvents) => {
  const id = idUnstripped.replaceAll(',', '').replaceAll('\\cite{','').replaceAll('}','')
  const res = Object.values(programEvents).flatMap((p) => {
    if (p.uuid === id) {
      return {
        programEventId: id,
      };
    } else {
      if (p.type === 'manual-entry-event') {
        return null;
      } else {
        return Object.values(p.meaningfulMoments).flatMap((m) => {
          if (m.uuid === id) {
            return ({
              programEventId: id,
              videoTimestamp: m.startTime,
            });
          } else {
            return null;
          }
        });
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

const splitTextIntoSegments = (text: string, keys: string[]) => {
  let ordering: Ordering[] = [];
  keys.forEach((k, i) => {
    const prior = i > 0 && ordering.length > i - 1 && ordering[i - 1].segments.length > 1 ? ordering[i - 1].segments[1] : text;
    ordering = [...ordering, { order: text.indexOf(k), value: k, segments: prior.split(k) }];
  });
  if (ordering.map((v) => v.order).includes(-1)) {
    return [{
      order: 1,
      value: '',
      segments: [text, '']
    }];
  }
  const t = ordering.sort((a, b) => a.order - b.order);
  return t;
}

const addCitations = (text: string, programEvents: CRProgramEvents) => {
  const regex = /\\cite{[^}]*}/g;
  const m = (r: RegExp) => {
    const res = text.match(regex);
    if (res === null) {
      return [];
    }
    return res;
  }
  const found = [...m(regex), ...m(regex)];
  if (found.length === 0) {
    return <span>{text}</span>;
  }
  console.log('results ', found, splitTextIntoSegments(text, found), 'original text: ', text);
  return (<div> {
    splitTextIntoSegments(text, found).map((v, i) => {
      const index = getIndex(v.value, programEvents);
      if (i === 0 && i === found.length - 1) {
        return <span key={index?.programEventId}><span>{v.segments[0]}</span><Button>{index !== undefined ? 'p=' + index.programEventId + 'time=' + index.videoTimestamp : 'missing link' + v.value}</Button><span>{v.segments[1]}</span></span>;
      } else if (i === found.length - 1) {
        return <span key={index?.programEventId}><Button>{index !== undefined ? 'p=' + index.programEventId + 'time=' + index.videoTimestamp : 'missing link' + v.value}</Button><span>{v.segments[1]}</span></span>;
      } else {
        return <span key={index?.programEventId}><span>{v.segments[0]}</span><Button>{index !== undefined ? 'p=' + index.programEventId + 'time=' + index.videoTimestamp : 'missing link' + v.value}</Button></span>;
      }
    })}
  </div>);
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
  longform
}) => {
  // NOTE: All this force updating is required to get the MDX
  // editor to load the proper content.
  // it's hacky, and could lead to bugs, but seems to be necessary.
  // If there are problems with this, try replacing mdx or using the
  // ref hook.
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const { pathname } = useLocation();
  const pageState = useRecoilValue(pageContextState);
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
        return addCitations(markdown, pageState.selectedCRProgramEvents);
      } else {
        return markdown;
      }
    } else {
      return (
        wrapAsLink(markdown, pathname, pageState.selectedCR));
    }
  }
  return (
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
  );
};

export default WYSIWYGEditor;
