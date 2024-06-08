/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
    frontmatterPlugin,
    headingsPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    quotePlugin,
    // tablePlugin,
    // thematicBreakPlugin,
    toolbarPlugin,
    KitchenSinkToolbar
} from '@mdxeditor/editor';

export const ALL_PLUGINS = [
    toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
    linkPlugin(),
    linkDialogPlugin(),
    // tablePlugin(),
    // thematicBreakPlugin(),
    frontmatterPlugin(),
];
