import React, { useEffect, useRef, useState } from "react";
import SplitPane, { Pane } from "react-split-pane";
import Editor from "@monaco-editor/react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import useWindowDimensions from "../../Components/WindowDimensions";
import { Select } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";

import { getLanguageToApiCode, runCodeUrl } from "../../Constants";
const { Option } = Select;

export default function CodeType({
  selectedQuestionIndex,
  setOverlayLoading,
  selected,
  setSelected,
}) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const editorRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const { enqueueSnackbar } = useSnackbar();

  const getUserCode = async () => {
    setOverlayLoading(true);
    await axios
      .get("/get_submitted_code", {
        params: {
          submissionId:
            selected.submissions[selectedQuestionIndex].submissionId,
        },
      })
      .then((res) => {
        // var newSelected = { ...selected };
        // newSelected.code = res.data.data.code;
        // newSelected.language = res.data.data.language;

        setCode(res.data.data.code);
        setLanguage(res.data.data.language);
        // setSelected(newSelected);
      })
      .catch((err) => {
        enqueueSnackbar("Some error occured while getting submission", {
          variant: "error",
        });
      });

    setOverlayLoading(false);
  };

  useEffect(() => {
    if (!selected.submissions[selectedQuestionIndex].submissionId) {
      return;
    }
    getUserCode();
  }, [selected, selectedQuestionIndex]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // editorRef.updateOptions({ readOnly: true })
  }
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const getEditorCode = () => {
    return editorRef.current.getValue();
  };

  const handleRun = async () => {
    setOverlayLoading(true);
    setOutput("");
    await axios
      .post(runCodeUrl, {
        code: getEditorCode(),
        language: getLanguageToApiCode(language),
        input: input,
      })
      .then((res) => {
        console.log("res: ", res);
        if (res.data.status == 200 && res.data.output.length !== 0) {
          setOutput(res.data.output);
        } else {
          enqueueSnackbar("Error in code", { variant: "warning" });
          setOutput(res.data.error);
        }
      })
      .catch((err) => {
        enqueueSnackbar("Some error occured while run.", { variant: "error" });
        // console.log(err);
      });
    setOverlayLoading(false);
  };

  return (
    <SplitPane
      minSize={height - 65 - 270}
      maxSize={height - 75}
      defaultSize={height - 65 - 170}
      split="horizontal"
    >
      <Pane style={{ height: "100%", width: "100%" }}>
        <div className="code-editor-nav">
          <span>
            <Button
              style={{
                color: "var(--primaryText)",
                backgroundColor: "none",
                width: "auto",
              }}
              onClick={handleRun}
            >
              <CaretRightOutlined />
              RunRevan
            </Button>
          </span>
          <span>
            <span style={{ color: "#fff", marginRight: "10px" }}>
              Language :
            </span>
            <Select
              value={language}
              style={{ width: 120 }}
              onChange={handleLanguageChange}
            >
              <Option value="cpp">CPP</Option>
              <Option value="c">C</Option>
              <Option value="java">Java</Option>
              <Option value="python">Python</Option>
            </Select>
          </span>
        </div>
        <Editor
          key={selected.submissions[selectedQuestionIndex].questionId}
          options={{ readOnly: true }}
          value={code || ""}
          theme="vs-dark"
          readOnly={true}
          language={language}
          // defaultValue={selected.code}
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
              onChange={(e) => {
                setInput(e.target.value);
                setOutput("");
              }}
              className="code-editor-input-textarea"
            />
          </div>
          <div
            style={{
              width: "100%",
              background: "var(--primaryBackground)",
              padding: "6px",
            }}
          >
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
  );
}
