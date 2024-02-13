import { Result } from "antd";
import React from "react";
import { BsPatchQuestion } from "react-icons/bs";
import { MdOutlineDoneAll } from "react-icons/md";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RenderEnrolled() {
    const breakpoints = {
        default: 5,
        1900: 4,
        1520: 3,
        1180: 2,
        830: 1,
    };
    const roomsDataReducer = useSelector(state => state.roomsDataReducer);


    return roomsDataReducer.enrolledRooms.length === 0 ? (
        <Result
            title="No Rooms enrolled."
        />
    ) : (
        <div className="myRooms-cards-outer">
            <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {roomsDataReducer.enrolledRooms.map(room => (
                    <Link to={"/enrolled_rooms/" + room.roomId} key={room.roomId}>
                        <div className="myRooms-cards-box" >
                            <div className="myRooms-cards-info">
                                <div className="myRooms-cards-title">
                                    {/* <AppstoreOutlined /> */}
                                    <span>{room.roomName}</span>
                                </div>
                                <div className="myRooms-cards-description">
                                    <BsPatchQuestion />
                                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "150px" }}>
                                        Questions
                                    </span>
                                    {room.questions}
                                </div>
                                <div className="myRooms-cards-description">
                                    <MdOutlineDoneAll />
                                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "150px" }}>
                                        Submitted
                                    </span>
                                    {room.submitted}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Masonry>
        </div>
    );
}
