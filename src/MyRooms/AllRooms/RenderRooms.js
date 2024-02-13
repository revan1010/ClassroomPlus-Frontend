import { Button, Result } from "antd";
import React from "react";
import { BsPeople, BsPatchQuestion } from "react-icons/bs";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RenderRooms({createNewRoom}) {
    const breakpoints = {
        default: 5,
        1900: 4,
        1520: 3,
        1180: 2,
        830: 1,
    };
    const roomsDataReducer = useSelector(state => state.roomsDataReducer);

    const getVisblity = (visibility) => {
        if(visibility === "public"){
            return(
                <div className="myRooms-room-visibility myRooms-public-room">
                    Public
                </div>
            )
        }
        else if(visibility === "private"){
            return(
                <div className="myRooms-room-visibility myRooms-private-room">
                    Private
                </div>
            )
        }
        else if(visibility === "hidden"){
            return(
                <div className="myRooms-room-visibility myRooms-hidden-room">
                    Hidden
                </div>
            )
        }
    }

    return roomsDataReducer.myRooms.length === 0 ? (
        <Result
            title="No Rooms created."
            extra={
                <Button type="primary" key="console" onClick={createNewRoom}>
                    Create First Room
                </Button>
            }
        />
    ) : (
        <div className="myRooms-cards-outer">
            <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {roomsDataReducer.myRooms.map(room => (
                    <Link to={"/my_rooms/" + room.roomId} key={room.roomId}>
                        <div className="myRooms-cards-box">
                            <div className="myRooms-cards-info">
                                <div className="myRooms-cards-title">
                                    {/* <AppstoreOutlined /> */}
                                    <span>{room.roomName}</span>
                                </div>
                                <div className="myRooms-cards-description">
                                    <BsPeople />
                                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "150px" }}>
                                        Enrolled
                                    </span>
                                    {room.enrolled}
                                </div>
                                <div className="myRooms-cards-description">
                                    <BsPatchQuestion />
                                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "150px" }}>
                                        Questions
                                    </span>
                                    {room.questions}
                                </div>
                            </div>
                            <div className="myRooms-card-bottom-bar">
                                {getVisblity(room.visibility)}
                            </div>
                        </div>
                    </Link>
                ))}
            </Masonry>
        </div>
    );
}
