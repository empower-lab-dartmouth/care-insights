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
import { Typography } from '@mui/material';
import Markdown from 'react-markdown'
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { pageContextState } from '../../../state/recoil';

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
};

const cleanLink = (t: string) => t.replaceAll('-', '').replaceAll('*', '').replaceAll(' ', '%20').trim();

const wrapAsLink = (text: string, pathname: string, currentCR: string) => {
  const newLineSplitText = text.split(/\n/);
  const baseURLLocal = 'http://localhost:3000/';
  const path = 'questions/'
  const promptPreface = 'Tell me more about: '.replaceAll(' ', '%20');
  const prompt = (t: string) => promptPreface + cleanLink(t);
  const wrappedBullets = newLineSplitText.map((t) => `[${t}](${baseURLLocal}${path}?cr="${currentCR}"&q="${prompt(t)}")`);
  return wrappedBullets.join('\n\n\n');
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  readOnly,
  showDefaultMessage,
  onChange,
  update,
  updateCallback,
  defaultMessage,
  loading,
  markdown,
}) => {
  // NOTE: All this force updating is required to get the MDX
  // editor to load the proper content.
  // it's hacky, and could lead to bugs, but seems to be necessary.
  // If there are problems with this, try replacing mdx or using the
  // ref hook.
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const {pathname} = useLocation();
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
    return (
      <Markdown>{wrapAsLink(markdown, pathname, pageState.selectedCR)}</Markdown>
    );
  }
  return (
    <div className='z-10'>
      <MDXEditor
        markdown={markdown}
        contentEditableClassName='prose z-10'
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkDialogPlugin(),
          imagePlugin({ imageUploadHandler }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {readOnly ? (
                  <></>
                ) : (
                  <>
                    <UndoRedo />
                    <Separator />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                    {/* <InsertThematicBreak /> */}
                    <InsertImage />
                  </>
                )}
              </>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default WYSIWYGEditor;
