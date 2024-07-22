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
      <MDXEditor
        markdown={markdown}
        readOnly={true}
        contentEditableClassName='prose'
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkDialogPlugin(),
          imagePlugin({ imageUploadHandler }),
          toolbarPlugin({
            toolbarContents: () => <></>,
          }),
        ]}
      />
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
