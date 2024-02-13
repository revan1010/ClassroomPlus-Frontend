import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { VscSymbolArray } from "react-icons/vsc";
import { FaEdit } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { Tabs } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import { logoutUser } from "../../Redux/Actions/AuthActions";
import SplitPane, { Pane } from "react-split-pane";
import { convertFromRaw, EditorState } from "draft-js";
import QuestionTemplate from "./QuestionTemplate";
import QuestionPreview from "./QuestionPreview";
import QuestionCases from "./QuestionCases";
import QuestionSettings from "./QuestionSettings";
import moment from "moment";
import { setBreadcrumb } from "../../Redux/Actions/RoomsDataActions";

const { TabPane } = Tabs;

export default function EditQuestion() {
  document.title = "Edit Question | Code Rooms";

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState({});
  const [sample, setSample] = useState({});

  const [testCases, setTestCases] = useState([]);
  const [questionSettings, setQuestionSettings] = useState({});
  const [roomInfo, setRoomInfo] = useState({});

  const queryParams = new URLSearchParams(useLocation().search);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(async () => {
    setLoading(true);
    if (!queryParams.has("qId")) {
      enqueueSnackbar("Invalid question.", { variant: "warning" });
      history.replace("/my_rooms");
    }
    await axios
      .get("/get_question_details", {
        params: {
          questionId: queryParams.get("qId"),
        },
      })
      .then((res) => {
        setTitle(res.data.questionDetails.title);
        setDescription(
          EditorState.createWithContent(
            convertFromRaw(res.data.questionDetails.template.description)
          )
        );
        setSample(res.data.questionDetails.template.sample);

        setTestCases(res.data.questionDetails.testCases || []);

        setQuestionSettings({
          _type: res.data.questionDetails._type,
          endTime: !res.data.questionDetails.endTime
            ? moment(moment().format()).add(7, "days").endOf("day").format()
            : res.data.questionDetails.endTime,
          isVisible: res.data.questionDetails.isVisible,
        });

        setRoomInfo({
          roomId: res.data.questionDetails.roomId,
          roomName: res.data.questionDetails.roomName,
        });
      })
      .catch((err) => {
        // console.log(err);
        try {
          if (err.response.status === 401) {
            dispatch(logoutUser());
            return;
          }
          enqueueSnackbar(err.response.data.detail, { variant: "error" });
          history.replace("/my_rooms");
        } catch (error) {
          enqueueSnackbar("Some error occured while creating new question", {
            variant: "error",
          });
          history.replace("/my_rooms");
        }
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "My Rooms",
          url: "/my_rooms",
        },
        {
          name: roomInfo.roomName,
          url: "/my_rooms/" + roomInfo.roomId,
        },
        {
          name: "Edit Question",
          url: "/question?qId=/" + queryParams.get("qId"),
        },
      ])
    );
  }, [roomInfo.roomId]);

  return loading ? (
    <div className="VerifyEmail-heading-div">
      <div>Getting Question Data ....</div>
      <div style={{ marginTop: "40px", position: "relative" }}>
        <SemipolarLoading size="large" color="var(--loadingColor)" />
      </div>
    </div>
  ) : (
    <div>
      <SplitPane
        style={{ position: "absolute" }}
        minSize={350}
        maxSize={620}
        defaultSize={400}
        split="vertical"
      >
        <Pane className="shlokOP">
          <QuestionPreview
            title={title}
            description={description}
            sample={sample}
          />
        </Pane>
        <div>
          <Tabs defaultActiveKey={queryParams.get("tab") || "edit"}>
            <TabPane
              tab={
                <div
                  className="myRooms-cards-description"
                  style={{ fontSize: "15px" }}
                >
                  <FaEdit />
                  <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                    Edit Question
                  </span>
                </div>
              }
              key="edit"
            >
              <QuestionTemplate
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                sample={sample}
                setSample={setSample}
                _type={questionSettings._type}
              />
            </TabPane>
            {questionSettings._type === "code" ? (
              <TabPane
                tab={
                  <div
                    className="myRooms-cards-description"
                    style={{ fontSize: "15px", padding: "0px", margin: "0px" }}
                  >
                    <VscSymbolArray />
                    <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                      Test cases
                    </span>
                  </div>
                }
                key="cases"
              >
                <QuestionCases
                  testCases={testCases}
                  setTestCases={setTestCases}
                />
              </TabPane>
            ) : (
              <></>
            )}
            <TabPane
              tab={
                <div
                  className="myRooms-cards-description"
                  style={{ fontSize: "15px" }}
                >
                  <FiSettings />
                  <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                    Settings
                  </span>
                </div>
              }
              key="settings"
            >
              <QuestionSettings
                questionSettings={questionSettings}
                setQuestionSettings={setQuestionSettings}
              />
            </TabPane>
          </Tabs>
        </div>
      </SplitPane>
    </div>
  );
}
