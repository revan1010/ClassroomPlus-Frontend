import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Popconfirm } from "antd";
import RenderQuestions from "./RenderQuestions";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import { logoutUser } from "../../Redux/Actions/AuthActions";
import { setBreadcrumb } from "../../Redux/Actions/RoomsDataActions";
import MyDivider from "../../Components/MyDivider";


export default function EnrolledRoom() {
    document.title = "Enrolled Room | Code Rooms";

    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Getting Data ....");
    const [questions, setQuestions] = useState([]);
    const [roomInfo, setRoomInfo] = useState([]);

    let { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const getRoomData = async() => {
        setLoading(true);
        await axios
            .get("/enrolled_rooms/" + id)
            .then(res => {
                setRoomInfo(res.data.roomInfo);
                setQuestions(res.data.questions);
            })
            .catch(err => {
                // console.log(err)
                if (!err.response) {
                    enqueueSnackbar("Some Error occurred while getting room data.", { variant: "error" });
                    history.replace("/enrolled_rooms");
                } else if (err.response.status === 401) {
                    dispatch(logoutUser());
                } else {
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                    history.replace("/enrolled_rooms");
                }
            });
        setLoading(false);
    }

    useEffect(() => {
        getRoomData();
    }, [id]);

    useEffect(() => {
        dispatch(setBreadcrumb( [
            {
                "name": "Enrolled Rooms",
                "url": "/enrolled_rooms"
            },
            {
                "name": roomInfo.roomName,
                "url": "/enrolled_rooms/" + roomInfo.roomId
            },
        ] ));
    }, [roomInfo.roomId]);

    const leaveRoom = async() => {
        await axios.post("/leave_room", {
            roomId: roomInfo.roomId,
        })
            .then(() => {
                history.replace("/enrolled_rooms")
            })
            .catch(err => {
                // console.log(err)
                if (!err.response) {
                    enqueueSnackbar("Some Error occurred while leaving room.", { variant: "error" });
                    history.replace("/enrolled_rooms");
                } else if (err.response.status === 401) {
                    dispatch(logoutUser());
                } else {
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                    history.replace("/enrolled_rooms");
                }
            })
    }

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
                <span >
                    <span>{roomInfo.roomName}</span>
                    <div style={{ }}>
                        <span style={{fontSize: '20px'}}>Host : {roomInfo.host}</span>
                    </div>
                </span>
                <Popconfirm
                    title={
                        <>
                            Are you sure you want to leave the room?<br /> 
                            This will delete all the submissions in this room and data will be lost forever.
                        </>
                    }
                    onConfirm={leaveRoom}
                    okText="Yes"
                    cancelText="Cancel"
                    overlayInnerStyle={{maxWidth: '400px', backgroundColor: 'var(--primaryBackground)', border: '2px solid var(--primaryText)'}}
                >
                    <Button danger={true} type="primary"  >
                        Leave Room
                    </Button>
                </Popconfirm>
            </div>

            <MyDivider />

            <RenderQuestions questions={questions} />
        </div>
    );
}
