import { CaretRightOutlined, SaveFilled } from "@ant-design/icons";
import { Button, Input, Modal, Select } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";

import { getLanguageToApiCode, runCodeUrl } from "../Constants";
const { Option } = Select;

export default function EditorNavbar({
  savedCodes,
  setSavedCodes,
  selectedCode,
  setSelectedCode,
  loading,
  setLoading,
  getEditorCode,
  input,
  setOutput,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [saveOpen, setSaveOpen] = useState(false);

  const handleLanguageChange = (value) => {
    const newData = { ...selectedCode };
    newData.language = value;
    setSelectedCode(newData);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    await axios
      .post(runCodeUrl, {
        code: getEditorCode(),
        language: getLanguageToApiCode(selectedCode.language),
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
        console.log(err);
        enqueueSnackbar("Error while running!", { variant: "error" });
      });
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);

    var newSaved = savedCodes.filter((code) => code.id !== selectedCode.id);
    newSaved.push({
      id: selectedCode.id,
      name: selectedCode.name,
      code: getEditorCode(),
      language: selectedCode.language,
    });
    setSavedCodes(newSaved);
    setSaveOpen(false);

    setTimeout(() => {
      setLoading(false);
      enqueueSnackbar("Code saved !", { variant: "success" });
    }, 500);
  };

  const changeName = (e) => {
    const newData = { ...selectedCode };
    newData.name = e.target.value;
    setSelectedCode(newData);
  };

  return (
    <div className="code-editor-nav">
      <Modal
        title="Save Code to local device"
        visible={saveOpen}
        // footer={[null]}
        // style={{border: '2px solid var(--primaryText)'}}
        onCancel={() => {
          setSaveOpen(false);
        }}
        onOk={handleSave}
      >
        Name &nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;&nbsp;
        <Input
          value={selectedCode.name}
          onChange={changeName}
          style={{ width: "200px" }}
        />
      </Modal>
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
          onClick={() => {
            setSaveOpen(true);
          }}
        >
          <SaveFilled />
          Save
        </Button>
      </span>
      <span>
        <span style={{ color: "#fff", marginRight: "10px" }}>Language :</span>
        <Select
          value={selectedCode.language}
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
