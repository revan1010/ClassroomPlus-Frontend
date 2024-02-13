import React, { useRef, useState } from "react";
import SplitPane, { Pane } from "react-split-pane";
import Editor from "@monaco-editor/react";
import { Modal } from "antd";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import EditorNavbar from "./EditorNavbar";
import useWindowDimensions from "../Components/WindowDimensions";
import RenderSaved from "./RenderSaved";


export default function MyEditor({ savedCodes, setSavedCodes, selectedCode, setSelectedCode }) {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const getEditorCode = () => {
        return editorRef.current.getValue()
    }

    const { height, width } = useWindowDimensions();

    return (
        <div className="questionEverything-outer-div">
            <Modal
                centered
                visible={loading}
                footer={null}
                bodyStyle={{padding: '0px'}}
                closable={false}
            >
                <SemipolarLoading size="large" color="var(--loadingColor)" />
            </Modal>

            <SplitPane style={{ position: "absolute" }} minSize={330} maxSize={620} defaultSize={400} split="vertical">
                <Pane>
                    <RenderSaved 
                        savedCodes={savedCodes}
                        setSavedCodes={setSavedCodes}
                        setSelectedCode={setSelectedCode}
                        setLoading={setLoading}
                        setOutput={setOutput}
                        setInput={setInput}
                    />
                </Pane>
                <SplitPane minSize={height - 65 - 270} maxSize={height - 75} defaultSize={height - 65 - 170} split="horizontal">
                    <Pane style={{ height: "100%", width: "100%"}} >
                        <EditorNavbar
                            savedCodes={savedCodes}
                            setSavedCodes={setSavedCodes}
                            selectedCode={selectedCode}
                            setSelectedCode={setSelectedCode}
                            loading={loading}
                            setLoading={setLoading}
                            getEditorCode={getEditorCode}
                            input={input}
                            setOutput={setOutput}
                        />
                        <Editor
                            theme="vs-dark"
                            language={selectedCode.language}
                            value={selectedCode.code}
                            onMount={handleEditorDidMount}
                            width="100%"
                        />
                    </Pane>
                    <Pane style={{ height: "100%", width: "100%"}} >
                        <div style={{display: 'inline-flex', width: '100%', height: '100%'}}>
                            <div style={{width: '100%', background: "var(--primaryBackground)", padding: '6px', borderRight: '2px solid var(--primaryText)'}}>
                                <div className="code-editor-input-title">Input</div>
                                <textarea 
                                    value={input} 
                                    onChange={(e) => {setInput(e.target.value); setOutput("")}} 
                                    className="code-editor-input-textarea"
                                />
                            </div>
                            <div style={{width: '100%', background: "var(--primaryBackground)", padding: '6px'}}>
                                <div className="code-editor-input-title">Output </div>
                                <div 
                                    style={{whiteSpace: 'pre', textAlign: 'left', fontSize: '17px'}}
                                    className="outer-scroll-div"
                                >
                                    {output}
                                </div>
                            </div>
                        </div>
                    </Pane>
                </SplitPane>
            </SplitPane>
        </div>
    );
}
