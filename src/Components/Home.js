import Countdown from "antd/lib/statistic/Countdown";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { RiCodeLine, RiFileAddLine } from "react-icons/ri";
import SemipolarLoading from "react-loadingg/lib/SemipolarLoading";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../Redux/Actions/AuthActions";
import { setBreadcrumb } from "../Redux/Actions/RoomsDataActions";
export default function Home() {
  document.title = "Home | ClassRoom Plus";

  const [loading, setLoading] = useState(true);
  const [due, setDue] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const authReducer = useSelector((state) => state.authReducer);

  useEffect(async () => {
    dispatch(setBreadcrumb([]));
    setLoading(true);
    await axios
      .get("/due_questions")
      .then((res) => {
        setDue(res.data.due);
      })
      .catch((err) => {
        if (!err.response) {
          enqueueSnackbar("Some Error occurred while getting due questions.", {
            variant: "error",
          });
          return;
        }
        if (err.response.status === 401) {
          dispatch(logoutUser());
        } else {
          enqueueSnackbar("Some Error occurred while getting due questions", {
            variant: "error",
          });
        }
      });
    setLoading(false);
  }, []);

  const timeConditions = (question) => {
    if (moment(question.endTime).diff(moment().format(), "seconds") < 0) {
      return (
        <div style={{ color: "var(--error)", fontSize: "22px" }}>
          Due date over
        </div>
      );
    }
    if (moment(question.endTime).diff(moment().format(), "hours") > 48) {
      return (
        <span
          style={{
            fontSize: "20px",
            display: "inline-flex",
            color: "var(--privateRoom)",
          }}
        >
          Due : {moment(question.endTime).format("Do MMM")}
        </span>
      );
    }
    if (moment(question.endTime).diff(moment().format(), "hours") > 24) {
      return (
        <span
          style={{
            fontSize: "20px",
            display: "inline-flex",
            color: "var(--privateRoom)",
          }}
        >
          Due : Tommorow
        </span>
      );
    }
    if (moment(question.endTime).diff(moment().format(), "hours") > 10) {
      return (
        <span
          style={{
            fontSize: "20px",
            display: "inline-flex",
            color: "var(--privateRoom)",
          }}
        >
          Due : Today
        </span>
      );
    } else {
      return (
        <div>
          <Countdown
            valueStyle={{ color: "var(--privateRoom)", fontSize: "22px" }}
            value={question.endTime}
            onFinish={() => {
              window.location.reload();
            }}
            format="[Due] : H[h] : m[m] : s[s]"
          />
        </div>
      );
    }
  };

  return loading ? (
    <div className="VerifyEmail-heading-div">
      <div>Getting Your Data ....</div>
      <div style={{ marginTop: "40px", position: "relative" }}>
        <SemipolarLoading size="large" color="var(--loadingColor)" />
      </div>
    </div>
  ) : due.length === 0 ? (
    <div className="playground-code-title" style={{ paddingTop: "20px" }}>
      {authReducer.accountType > 0 ? (
        <p>Home Page</p>
      ) : (
        <p> No Questions Due !!</p>
      )}
    </div>
  ) : (
    <>
      <div className="playground-code-title" style={{ paddingTop: "20px" }}>
        Questions Due
      </div>
      <div style={{ fontSize: "20px", color: "#fff" }}>
        {due.map((question) => (
          <Link to={"/question?qId=" + question.questionId} key={"room.roomId"}>
            <div className="myRooms-cards-box">
              <div className="myRooms-cards-info">
                <div className="myRooms-cards-title">
                  <span>{question.title}</span>
                </div>
              </div>

              <div>
                <div className="myRooms-cards-description">
                  <span
                    style={{
                      marginLeft: "10px",
                      display: "inline-flex",
                      minWidth: "70px",
                      fontWeight: "bolder",
                    }}
                  >
                    Room
                  </span>
                  : {question.roomName}
                </div>
                <div
                  className="myRooms-cards-description"
                  style={{ marginLeft: "8px" }}
                >
                  {question._type === "code" ? (
                    <>
                      <RiCodeLine />
                      <span
                        style={{ marginLeft: "10px", display: "inline-flex" }}
                      >
                        Code Type
                      </span>
                    </>
                  ) : (
                    <>
                      <RiFileAddLine />
                      <span
                        style={{ marginLeft: "10px", display: "inline-flex" }}
                      >
                        File Type
                      </span>
                    </>
                  )}
                </div>
                <div className="myRooms-card-bottom-bar">
                  {timeConditions(question)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
