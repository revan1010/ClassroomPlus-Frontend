import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "antd";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import RenderEnrolled from "./RenderEnrolled";
import { setBreadcrumb } from "../../Redux/Actions/RoomsDataActions";

export default function AllEnrolled({getEnrolledRoomsData}) {
    document.title = "Enrolled Rooms | Code Rooms";

    const roomsDataReducer = useSelector(state => state.roomsDataReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getEnrolledRoomsData()
        dispatch(setBreadcrumb( [
            {
                "name": "Enrolled Rooms",
                "url": "/enrolled_rooms"
            }
        ] ));
    }, [])


    return roomsDataReducer.myRoomsLoading ? (
        <div className="VerifyEmail-heading-div">
            <div>Getting Your Rooms Data ....</div>
            <div style={{marginTop: "40px", position: 'relative'}}>
                <SemipolarLoading size="large" color="var(--loadingColor)"  />
            </div>
        </div>
    ) : (
        <div className="myRooms-outer-div">

            <div className="myRooms-header">
                <span>Enrolled Rooms</span>
            </div>

            <Divider />

            <RenderEnrolled />
        </div>
    );
}
