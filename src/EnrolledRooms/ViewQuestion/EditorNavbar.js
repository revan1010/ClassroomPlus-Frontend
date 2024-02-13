import React from "react";
import {
  CaretRightOutlined,
  SaveFilled,
  SendOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Select } from "antd";
import axios from "axios";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import moment from "moment";

import { getLanguageToApiCode, runCodeUrl } from "../../Constants";
const { Option } = Select;

export default function EditorNavbar({
  questionDetails,
  setQuestionDetails,
  loading,
  setLoading,
  getEditorCode,
  input,
  setOutput,
}) {
  const queryParams = new URLSearchParams(useLocation().search);
  const { enqueueSnackbar } = useSnackbar();

  const handleLanguageChange = (value) => {
    const newData = { ...questionDetails };
    newData.language = value;
    setQuestionDetails(newData);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    await axios
      .post(runCodeUrl, {
        code: getEditorCode(),
        language: getLanguageToApiCode(questionDetails.language),
        input: input,
      })
      .then((res) => {
        if (res.data.status == 200 && res.data.output.length !== 0) {
          setOutput(res.data.output);
        } else {
          enqueueSnackbar("Error in code", { variant: "warning" });
          setOutput(res.data.error);
        }
      })
      .catch((err) => {
        enqueueSnackbar("Some issue while run.", { variant: "error" });
      });
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await axios
      .post("/save_question_code", {
        questionId: queryParams.get("qId"),
        code: getEditorCode(),
        language: questionDetails.language,
      })
      .then((res) => {
        enqueueSnackbar("Saved successfully.", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Some issue while saving.", { variant: "error" });
      });
    setLoading(false);
  };
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post("/submit_question_code", {
        questionId: queryParams.get("qId"),
        code: getEditorCode(),
        language: questionDetails.language,
      })
      .then((res) => {
        if (res.data.noOfCases === 0) {
          enqueueSnackbar("Submitted successfully.", { variant: "success" });
        } else if (res.data.casesPassed === res.data.noOfCases) {
          enqueueSnackbar(
            "Submitted successfully. " +
              res.data.casesPassed +
              " out of " +
              res.data.noOfCases +
              " cases passes",
            { variant: "success" }
          );
        } else {
          enqueueSnackbar(
            "Submitted successfully. " +
              res.data.casesPassed +
              " out of " +
              res.data.noOfCases +
              " cases passes",
            { variant: "warning" }
          );
        }
        setQuestionDetails({
          ...questionDetails,
          submitted: true,
          submittedAt: moment().format(),
        });
      })
      .catch((err) => {
        enqueueSnackbar("Some issue while submitting.", { variant: "error" });
      });
    setLoading(false);
  };

  return (
    <div className="code-editor-nav">
      <span>
        <Button
          style={{
            color: "var(--primaryText)",
            backgroundColor: "none",
            width: "auto",
          }}
          onClick={handleRun}
          disabled={loading}
        >
          <CaretRightOutlined />
          Run
        </Button>
        <Button
          style={{
            color: "var(--primaryText)",
            backgroundColor: "none",
            width: "auto",
          }}
          onClick={handleSave}
        >
          <SaveFilled />
          Save
        </Button>
        {moment(questionDetails.endTime).isAfter(moment().format()) ? (
          <Button
            style={{
              color: "var(--primaryText)",
              backgroundColor: "none",
              width: "auto",
            }}
            onClick={handleSubmit}
          >
            <SendOutlined />
            Submit
          </Button>
        ) : (
          <></>
        )}
      </span>
      <span>
        <span style={{ color: "#fff", margin: "0px 10px 0px 10px" }}>
          Language :
        </span>
        <Select
          value={questionDetails.language}
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
  );
}
