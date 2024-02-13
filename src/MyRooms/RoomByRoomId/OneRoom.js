import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import {
  CopyOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { BsPeople, BsPatchQuestion } from "react-icons/bs";
import { MdOutlineEmojiPeople } from "react-icons/md";
import { RiDeleteBin5Line, RiCodeLine, RiFileAddLine } from "react-icons/ri";
import RoomSettings from "./RoomSettings";
import { Popconfirm, Tabs, Tooltip, Menu, Dropdown } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";

import { logoutUser } from "../../Redux/Actions/AuthActions";
import RenderQuestions from "./RenderQuestions";
import RoomEnrolled from "./RoomEnrolled";
import RoomWaiting from "./RoomWaiting";
import { setBreadcrumb } from "../../Redux/Actions/RoomsDataActions";
import MyDivider from "../../Components/MyDivider";

const { TabPane } = Tabs;

export default function OneRoom({ getMyRoomsData }) {
  document.title = "My Room | Code Rooms";

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Getting Data ....");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [enrolledTable, setEnrolledTable] = useState([]);
  const [waitingTable, setWaitingTable] = useState([]);

  let { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = new URLSearchParams(useLocation().search);

  const showSettings = () => {
    setSettingsVisible(true);
  };

  const getInitialData = async () => {
    setLoading(true);
    // setLoadingMessage("Refreshing data ....")
    await axios
      .get("/my_rooms/" + id)
      .then((res) => {
        // console.log(res)
        setRoomInfo(res.data.roomInfo);
        setQuestions(res.data.questions);
      })
      .catch((err) => {
        if (!err.response) {
          enqueueSnackbar("Some Error occurred while getting room data.", {
            variant: "error",
          });
        } else if (err.response.status === 401) {
          dispatch(logoutUser());
        } else {
          enqueueSnackbar(err.response.data.detail, { variant: "error" });
          history.replace("/my_rooms");
        }
      });
    if (queryParams.has("settingsOpen")) {
      setSettingsVisible(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInitialData();
  }, [id]);

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
      ])
    );
  }, [roomInfo.roomId]);

  const createNewQuestion = async (type) => {
    setLoadingMessage("Setting up new question template .....");
    setLoading(true);

    await axios
      .post("/create_question", {
        roomId: id,
        type: type, // code or file
      })
      .then((res) => {
        history.push("/edit_question?qId=" + res.data.newQuestionId);
      })
      .catch((err) => {
        try {
          if (err.response.status === 401) {
            dispatch(logoutUser());
            return;
          }
          enqueueSnackbar(err.response.data.detail, { variant: "error" });
        } catch (error) {
          enqueueSnackbar("Some error occured while creating new question", {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  const copyToClipboard = () => {
    var toCopy =
      window.location.origin + "/#/join_room?roomId=" + roomInfo.roomId;

    var temp = document.createElement("textarea");
    var tempMsg = document.createTextNode(toCopy);
    temp.appendChild(tempMsg);

    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);

    var message = "Link copied to clipboard.";
    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  const deleteRoom = async () => {
    setLoadingMessage("Deleting room ....");
    setLoading(true);
    await axios
      .post("/delete_room", {
        roomId: id,
      })
      .then(() => {
        enqueueSnackbar("Room deleted succesfully!", { variant: "info" });
        getMyRoomsData();
        history.replace("/my_rooms");
      })
      .catch((err) => {
        try {
          if (err.response.status === 401) {
            dispatch(logoutUser());
            return;
          }
          enqueueSnackbar(err.response.data.detail, { variant: "error" });
        } catch (error) {
          enqueueSnackbar("Some error occured while deleting this room", {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  return loading ? (
    <div className="VerifyEmail-heading-div">
      <div>{loadingMessage}</div>
      <div style={{ marginTop: "40px", position: "relative" }}>
        <SemipolarLoading size="large" color="var(--loadingColor)" />
      </div>
    </div>
  ) : (
    <div className="myRooms-outer-div">
      <div className="myRooms-header">
        <span style={{ borderBottom: "2px solid " }}>{roomInfo.roomName}</span>
        <div style={{ display: "inline-flex" }}>
          <div
            className="myRooms-createNew-button"
            style={{ marginLeft: "15px" }}
            onClick={copyToClipboard}
          >
            <Tooltip title="Copy joining link">
              <CopyOutlined />
            </Tooltip>
          </div>

          <Dropdown
            overlay={
              <Menu style={{ background: "var(--secondaryBackground)" }}>
                <Menu.Item
                  icon={<RiCodeLine style={{ fontSize: "20px" }} />}
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    createNewQuestion("code");
                  }}
                >
                  Code Type Question
                </Menu.Item>
                <MyDivider />
                <Menu.Item
                  icon={<RiFileAddLine style={{ fontSize: "20px" }} />}
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    createNewQuestion("file");
                  }}
                >
                  File Type Question
                </Menu.Item>
              </Menu>
            }
            placement="bottomCenter"
          >
            <div
              className="myRooms-createNew-button"
              style={{ marginLeft: "15px" }}
            >
              <PlusCircleOutlined />
              <span style={{ marginLeft: "5px" }}> Create Question </span>
              {/* <DownOutlined style={{marginLeft: '5px', fontSize: '18px'}} /> */}
            </div>
          </Dropdown>

          <div
            className="myRooms-createNew-button"
            style={{ marginLeft: "15px" }}
            onClick={showSettings}
          >
            <SettingOutlined />
            <span style={{ marginLeft: "5px" }}> Settings </span>
          </div>
          <Popconfirm
            title={
              <>
                Are you sure you want to delete this Room?
                <br />
                Deleting this room will remove all its data and will be lost
                forever !
              </>
            }
            onConfirm={deleteRoom}
            okText="Yes"
            cancelText="Cancel"
            overlayInnerStyle={{
              maxWidth: "400px",
              backgroundColor: "var(--primaryBackground)",
              border: "2px solid var(--primaryText)",
            }}
          >
            <div
              className="myRooms-createNew-button"
              style={{ marginLeft: "15px" }}
            >
              <RiDeleteBin5Line />
            </div>
          </Popconfirm>
          <RoomSettings
            settingsVisible={settingsVisible}
            setSettingsVisible={setSettingsVisible}
            roomInfo={roomInfo}
            setRoomInfo={setRoomInfo}
          />
        </div>
      </div>

      {/* <Divider /> */}

      <Tabs defaultActiveKey={queryParams.get("tab") || "questions"}>
        <TabPane
          tab={
            <div
              className="myRooms-cards-description"
              style={{ fontSize: "15px" }}
            >
              <BsPatchQuestion />
              <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                Questions
              </span>
              ({questions.length})
            </div>
          }
          key="questions"
        >
          <RenderQuestions
            getInitialData={getInitialData}
            questions={questions}
            enrolled={roomInfo.enrolled}
          />
        </TabPane>
        <TabPane
          tab={
            <div
              className="myRooms-cards-description"
              style={{ fontSize: "15px", padding: "0px", margin: "0px" }}
            >
              <BsPeople />
              <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                Members
              </span>
              ({roomInfo.enrolled})
            </div>
          }
          key="members"
        >
          <RoomEnrolled
            noOfQuestions={questions.length}
            roomInfo={roomInfo}
            setRoomInfo={setRoomInfo}
            enrolledTable={enrolledTable}
            setEnrolledTable={setEnrolledTable}
          />
        </TabPane>
        {roomInfo.waitingRoomEnabled ? (
          <TabPane
            tab={
              <div
                className="myRooms-cards-description"
                style={{ fontSize: "15px" }}
              >
                <MdOutlineEmojiPeople />
                <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                  Waiting Room
                </span>
                ({roomInfo.waitingRoomCount})
              </div>
            }
            key="waitingRoom"
          >
            <RoomWaiting
              roomInfo={roomInfo}
              setRoomInfo={setRoomInfo}
              waitingTable={waitingTable}
              setWaitingTable={setWaitingTable}
              enrolledTable={enrolledTable}
              setEnrolledTable={setEnrolledTable}
            />
          </TabPane>
        ) : (
          <></>
        )}
      </Tabs>
    </div>
  );
}
