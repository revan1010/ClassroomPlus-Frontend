import { Button, Input } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import PointSpreadLoading from "react-loadingg/lib/PointSpreadLoading";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { logoutUser } from "../Redux/Actions/AuthActions";
import { setEnrolled } from "../Redux/Actions/RoomsDataActions";

export default function JoinRoom() {
  document.title = "Join Room | Code Rooms";

  const [loading, setLoading] = useState(true);
  const [specialFields, setSpecialFields] = useState([]);
  const [specialInfo, setSpecialInfo] = useState([]);

  const queryParams = new URLSearchParams(useLocation().search);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const dispatch = useDispatch();

  const joinRoom1 = () => {
    setLoading(true);
    if (!queryParams.has("roomId")) {
      enqueueSnackbar("Invalid Room", { variant: "error" });
      history.replace("/enrolled_rooms");
      return;
    }
    axios
      .post("/join_room", {
        roomId: queryParams.get("roomId"),
        specialFields: specialInfo,
      })
      .then((res) => {
        if (res.data.specialFields) {
          setSpecialFields(res.data.specialFields);
          var data = [];
          for (var i = 0; i < res.data.specialFields.length; i++) {
            data.push("");
          }
          setSpecialInfo(data);
          setLoading(false);
          return;
        }

        if (res.data.waitingRoomEnabled) {
          enqueueSnackbar(
            `You are now in waiting Room for ${res.data.roomName}.`,
            { variant: "info" }
          );
        } else {
          enqueueSnackbar(`Joined Room - ${res.data.roomName} successfully.`, {
            variant: "success",
          });
        }

        dispatch(setEnrolled(res.data.enrolledRooms));
        history.replace("/enrolled_rooms");
      })
      .catch((err) => {
        try {
          if (!err.response) {
            history.replace("/enrolled_rooms");
            enqueueSnackbar("Some Error occurred while joining room", {
              variant: "warning",
            });
            return;
          }
          if (err.response.status === 401) {
            enqueueSnackbar("Please login first.", { variant: "info" });
            dispatch(logoutUser());
            return;
          }

          enqueueSnackbar(err.response.data.detail, { variant: "warning" });
          history.replace("/enrolled_rooms");
        } catch (error) {
          enqueueSnackbar("Some Error occurred while joining room", {
            variant: "warning",
          });
          history.replace("/enrolled_rooms");
        }
      });
    setLoading(false);
  };

  useEffect(async () => {
    joinRoom1();
  }, []);

  const changeSpecialField = (e, index) => {
    const newData = [...specialInfo];
    newData[index] = e.target.value;
    setSpecialInfo(newData);
  };

  return loading ? (
    <div className="VerifyEmail-outer-div">
      <div className="VerifyEmail-heading-div">Joining room ...</div>
      <div style={{ marginTop: "20px", position: "relative" }}>
        <PointSpreadLoading color="var(--loadingColor)" />
      </div>
    </div>
  ) : specialFields.length > 0 ? (
    <div className="VerifyEmail-outer-div">
      <div className="VerifyEmail-heading-div">
        Enter details to continue ...
      </div>
      <div>
        {specialFields.map((name, index) => (
          <div>
            <div
              style={{
                display: "inline-flex",
                margin: "10px",
                alignItems: "center",
              }}
            >
              <span style={{ minWidth: "100px" }}>{name} : </span>
              <Input
                value={specialInfo[index]}
                onChange={(e) => {
                  changeSpecialField(e, index);
                }}
                required={true}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        htmlType="submit"
        type="primary"
        onClick={() => {
          joinRoom1();
        }}
      >
        Submit
      </Button>
    </div>
  ) : (
    <></>
  );
}
