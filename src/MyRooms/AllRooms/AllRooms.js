import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "antd";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import RenderRooms from "./RenderRooms";
import { removeMyRoomsLoading, setBreadcrumb, setMyRooms, setMyRoomsLoading } from "../../Redux/Actions/RoomsDataActions";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { logoutUser } from "../../Redux/Actions/AuthActions";

export default function AllRooms({getMyRoomsData}) {
    document.title = "My Rooms | Code Rooms";

    const [loadingMessage, setLoadingMessage] = useState("Getting Your Rooms Data ....");
    
    const roomsDataReducer = useSelector(state => state.roomsDataReducer);
    const authReducer = useSelector(state => state.authReducer);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const queryParams = new URLSearchParams(useLocation().search);

    const createBreadcrumb = () => {
        getMyRoomsData()
        dispatch(setBreadcrumb( [
            {
                "name": "My Rooms",
                "url": "/my_rooms"
            }
        ] ));
    }

    useEffect(() => {
        createBreadcrumb();
        if(queryParams.has("createNewRoom")){
            createNewRoom();
        }
    }, [queryParams.get("createNewRoom")])

    const createNewRoom = async() => {
        setLoadingMessage("Creating a new Room, please wait ....");
        dispatch(setMyRoomsLoading());
        await axios.post("/create_room", {
            roomName: authReducer.firstName + "'s Room " + (roomsDataReducer.myRooms.length + 1)
        })
            .then(res => {
                dispatch(setMyRooms(res.data.myRooms))
                history.push("/my_rooms/" + res.data.newRoomId + "?settingsOpen=true");
            })
            .catch(err => {
                if(!err.response){
                    enqueueSnackbar("Some Error occurred while creating room", {variant: 'error'});
                    return;
                }
                if(err.response.status === 401){
                    dispatch(logoutUser());
                }
                else{
                    enqueueSnackbar("Some Error occurred while creating room", {variant: 'error'})
                }
            })
        dispatch(removeMyRoomsLoading());
    }

    

    return roomsDataReducer.myRoomsLoading ? (
        <div className="VerifyEmail-heading-div">
            <div>{loadingMessage}</div>
            <div style={{marginTop: "40px", position: 'relative'}}>
                <SemipolarLoading size="large" color="var(--loadingColor)"  />
            </div>
        </div>
    ) : (
        <div className="myRooms-outer-div">

            <div className="myRooms-header">
                <span>Your Rooms</span>
                <div className="myRooms-createNew-button" onClick={createNewRoom}>
                    <PlusCircleOutlined />
                    <span style={{marginLeft: '5px'}}> Create New </span>
                </div>
            </div>

            <Divider />

            <RenderRooms createNewRoom={createNewRoom} />
        </div>
    );
}
