import { Button, ButtonGroup } from "@mantine/core"
import { GenericJsxEditor, JsxComponentDescriptor, MDXEditor, NestedLexicalEditor, insertJsx$, jsxPlugin, toolbarPlugin, usePublisher } from "@mdxeditor/editor"
import { MenuButton } from "../../../components/UserShell"
import { FileQuestion } from "lucide-react"
import { replaceKeyInURI } from "../../videoAnalysis/programEventsTable/StreamGraph/utils"



const jsxComponentDescriptors: JsxComponentDescriptor[] = [
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