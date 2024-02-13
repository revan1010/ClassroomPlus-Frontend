import React, { useRef, useState } from "react";
import SplitPane, { Pane } from "react-split-pane";
import Editor from "@monaco-editor/react";
import useWindowDimensions from "../../Components/WindowDimensions";
import EditorNavbar from "./EditorNavbar";

export default function CodeType({overlayLoading, setOverlayLoading, questionDetails, setQuestionDetails }) {
    const editorRef = useRef(null);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const getEditorCode = () => {
        return editorRef.current.getValue();
    };

    const { height, width } = useWindowDimensions();

    return (
        <SplitPane minSize={height - 65 - 270} maxSize={height - 75} defaultSize={height - 65 - 170} split="horizontal">
            <Pane style={{ height: "100%", width: "100%"}} >
                <EditorNavbar
                    questionDetails={questionDetails}
                    setQuestionDetails={setQuestionDetails}
                    loading={overlayLoading}
                    setLoading={setOverlayLoading}
                    getEditorCode={getEditorCode}
                    input={input}
                    setOutput={setOutput}
                />
                <Editor
                    theme="vs-dark"
                    language={questionDetails.language}
                    defaultValue={questionDetails.savedCode}
                    onMount={handleEditorDidMount}
                />
            </Pane>
            <Pane style={{ height: "100%", widht: "100%" }}>
                <div style={{ display: "inline-flex", width: "100%", height: "100%" }}>
                    <div
                        style={{
                            width: "100%",
                            background: "var(--primaryBackground)",
                            padding: "6px",
                            borderRight: "2px solid var(--primaryText)",
                        }}
                    >
                        <div className="code-editor-input-title">Input</div>

                        <textarea
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                setOutput("");
                            }}
                            className="code-editor-input-textarea"
                        />
                    </div>
                    <div style={{ width: "100%", background: "var(--primaryBackground)", padding: "6px" }}>
                        <div className="code-editor-input-title">Output </div>
                        <div
                            style={{ whiteSpace: "pre", textAlign: "left", fontSize: "17px" }}
                            className="outer-scroll-div"
                        >
                            {output}
                        </div>
                    </div>
                </div>
            </Pane>
        </SplitPane>
    )
}
