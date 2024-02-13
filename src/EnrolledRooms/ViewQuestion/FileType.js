import { UploadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Upload } from "antd";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import FileViewer from "react-file-viewer";
import { useLocation } from "react-router";

import { backendURL } from "../../Constants";

export default function FileType({
  setOverlayLoading,
  questionDetails,
  setQuestionDetails,
}) {
  const [src, setSrc] = useState("");
  const [file, setFile] = useState(null);

  const queryParams = new URLSearchParams(useLocation().search);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!questionDetails.submitted) {
      enqueueSnackbar(
        "File should be .pdf type and file size should not exceed 7MB",
        { variant: "warning" }
      );
    }
  }, [questionDetails.submitted]);

  const deleteSubmission = async () => {
    setOverlayLoading(true);
    await axios
      .post("/delete_submitted_file", {
        questionId: queryParams.get("qId"),
        submissionId: questionDetails.submissionId,
      })
      .then((res) => {
        setQuestionDetails({
          ...questionDetails,
          submitted: false,
        });
        setFile(null);
        setSrc("");
        enqueueSnackbar("Deleted Submission!", { variant: "info" });
      })
      .catch((err) => {
        enqueueSnackbar("Some error occurred while deleting !", {
          variant: "error",
        });
      });
    setOverlayLoading(false);
  };

  const handleBeforeUpload = (e) => {
    try {
      setSrc(URL.createObjectURL(e));
      setFile(e);
      return false;
    } catch (err) {
      setFile(null);
      setSrc("");
      return false;
    }
  };

  const handleChange = (e) => {
    if (e.fileList.length === 0) {
      setFile(null);
      setSrc("");
      return;
    }

    try {
      setSrc(URL.createObjectURL(e.file));
      setFile(e.file);
    } catch (err) {
      setFile(null);
      setSrc("");
      return;
    }
  };

  const handleSubmitFile = async () => {
    setOverlayLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    if (formData !== null) {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      await axios
        .post(
          "/submit_question_file/" + queryParams.get("qId"),
          formData,
          config
        )
        .then((res) => {
          setQuestionDetails({
            ...questionDetails,
            submitted: true,
            submittedAt: moment().format(),
            submissionId: res.data.submissionId,
          });
          enqueueSnackbar("File submitted successfully !", {
            variant: "success",
          });
        })
        .catch((err) => {
          try {
            enqueueSnackbar(err.response.data.detail, { variant: "error" });
          } catch (error) {
            enqueueSnackbar("Some issue while submitting.", {
              variant: "error",
            });
          }
        });
    }
    setOverlayLoading(false);
  };

  const downloadPDF = () => {
    fetch(
      `${backendURL}/get_submitted_file?questionId=${queryParams.get(
        "qId"
      )}&submissionId=${
        questionDetails.submissionId
      }&token=${localStorage.getItem("JWTtoken")}`
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "Submission.pdf";
        a.click();
      });
    });
  };

  return questionDetails.submitted ? (
    <>
      {moment(questionDetails.endTime).isAfter(moment().format()) ? (
        <Popconfirm
          title={
            <>
              Are you sure you want to submit again?
              <br />
              This will delete your previous submission.
            </>
          }
          onConfirm={deleteSubmission}
          okText="Yes"
          cancelText="Cancel"
          overlayInnerStyle={{
            maxWidth: "400px",
            backgroundColor: "var(--primaryBackground)",
            border: "2px solid var(--primaryText)",
          }}
        >
          <Button style={{ marginTop: "10px" }} type="primary" danger={true}>
            Change Submission
          </Button>
        </Popconfirm>
      ) : (
        <></>
      )}
      <Button
        onClick={downloadPDF}
        style={{ marginTop: "10px", marginLeft: "10px" }}
        type="primary"
      >
        Download PDF
      </Button>
      <FileViewer
        fileType={"pdf"}
        filePath={`${backendURL}/get_submitted_file?questionId=${queryParams.get(
          "qId"
        )}&submissionId=${
          questionDetails.submissionId
        }&token=${localStorage.getItem("JWTtoken")}`}
      />
    </>
  ) : moment(questionDetails.endTime).isAfter(moment().format()) ? (
    <>
      <div
        style={{
          height: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px 0px 30px 0px",
        }}
      >
        <Upload
          listType="picture"
          beforeUpload={handleBeforeUpload}
          maxCount={1}
          multiple={false}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="upload-list-inline"
        >
          <Button icon={<UploadOutlined />} style={{ height: "66px" }}>
            Upload
          </Button>
        </Upload>
        {/* <img src={src} style={{border: '2px solid white', width: '100%'}} /> */}
        <Button
          onClick={handleSubmitFile}
          type="primary"
          style={{ margin: "0px 30px 0px 0px", height: "66px" }}
          disabled={file === null}
        >
          Submit
        </Button>
      </div>
      {file !== null ? (
        <>
          <FileViewer
            controls={true}
            fileType={"pdf"}
            filePath={src}
            key={src}
          />
        </>
      ) : (
        <></>
      )}
    </>
  ) : (
    <div
      className="playground-code-title"
      style={{ color: "var(--privateRoom)" }}
    >
      Due Date Over
    </div>
  );
}
