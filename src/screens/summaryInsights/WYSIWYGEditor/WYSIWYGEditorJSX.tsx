import { Button, ButtonGroup } from "@mantine/core"
import { GenericJsxEditor, JsxComponentDescriptor, MDXEditor, NestedLexicalEditor, insertJsx$, jsxPlugin, toolbarPlugin, usePublisher } from "@mdxeditor/editor"
import { MenuButton } from "../../../components/UserShell"
import { FileQuestion } from "lucide-react"
import { replaceKeyInURI } from "../../videoAnalysis/programEventsTable/StreamGraph/utils"


// {
//     name: 'GoTo',
//     kind: 'text',
//     source: './external',
//     props: [
//         { name: 'query', type: 'string'},
//         { name: 'text', type: 'string'}
//     ],
//     hasChildren: true,
//     Editor: () => {
//         return (
//             <Button >
//                 { text }
//             </Button>
//         )
//     }
// },

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    // {
    //     name: 'MyLeaf',
    //     kind: 'text', // 'text' for inline, 'flow' for block
    //     // the source field is used to construct the import statement at the top of the markdown document.
    //     // it won't be actually sourced.
    //     source: './external',
    //     // Used to construct the property popover of the generic editor
    //     props: [
    //       { name: 'foo', type: 'string' },
    //       { name: 'bar', type: 'string' },
    //       { name: 'onClick', type: 'expression' }
    //     ],
    //     // whether the component has children or not
    //     hasChildren: true,
    //     Editor: GenericJsxEditor
    //   },
    //   {
    //     name: 'Marker',
    //     kind: 'text',
    //     source: './external',
    //     props: [{ name: 'type', type: 'string' }],
    //     hasChildren: false,
    //     Editor: () => {
    //       return (
    //         <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
                
    //           <NestedLexicalEditor<any>
    //             getContent={(node) => node.children}
    //             getUpdatedMdastNode={(mdastNode, children: any) => {
    //               return { ...mdastNode, children }
    //             }}
    //           />
    //         </div>
    //       )
    //     }
    //   },
      {
        name: 'GoTo',
        kind: 'flow',
        source: './external',
        props: [{ name: 'query', type: 'string' }],
        hasChildren: true,
        Editor: (n) => {
            const query = n.mdastNode.attributes[0].value as string;
            const newUri = new URL(replaceKeyInURI(location.href, 'q', query));
            const search = newUri.searchParams.toString();
        return (<>{query}<Button><MenuButton path='/questions' search={search} icon={<FileQuestion size={18} />}>More info</MenuButton></Button></>);
        }
      }
    ]


// a toolbar button that will insert a JSX element into the editor.
const InsertMyLeaf = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
        <Button
            onClick={() =>
                insertJsx({
                    name: 'MyLeaf',
                    kind: 'text',
                    props: { foo: 'bar', bar: 'baz', onClick: { type: 'expression', value: '() => console.log("Clicked")' } }
                })
            }
        >
            Leaf
        </Button>
    )
}

const jsxMarkdown = `import { BlockNode } from './external';


<GoTo query="fooValue" />
<GoTo query="v2222" />
<GoTo query="v333" />`;

export const Example: React.FC = () => {
    return (
        <MDXEditor
            markdown={jsxMarkdown} // the contents of the file  below
            onChange={console.log}
            plugins={[
                jsxPlugin({ jsxComponentDescriptors }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <InsertMyLeaf />
                        </>
                    )
                })
            ]}
        />
    )
}