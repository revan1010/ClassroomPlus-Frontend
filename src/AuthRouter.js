import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "./Redux/Actions/AuthActions";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Home from "./Components/Home";
import MyNavbar from "./Navbar/MyNavbar";
import AllRooms from "./MyRooms/AllRooms/AllRooms";
import OneRoom from "./MyRooms/RoomByRoomId/OneRoom";
import { useSnackbar } from "notistack";
import {
  setMyRooms,
  removeMyRoomsLoading,
  setEnrolled,
  removeEnrolledLoading,
  setEnrolledLoading,
  setMyRoomsLoading,
} from "./Redux/Actions/RoomsDataActions";
import AllEnrolled from "./EnrolledRooms/AllEnrolled/AllEnrolled";
import JoinRoom from "./EnrolledRooms/JoinRoom";
import EnrolledRoom from "./EnrolledRooms/EnrolledById/EnrolledRoom";
import EditQuestion from "./MyRooms/EditQuestion/EditQuestion";
import CodePlayground from "./CodePlayground/CodePlayground";
// import ViewQuestion from "./Questions/ViewQuestion/ViewQuestion";
import ViewQuestion from "./EnrolledRooms/ViewQuestion/ViewQuestion";
import CheckSubmissions from "./MyRooms/CheckSubmissions/CheckSubmissions";
import UserSettings from "./Components/UserSettings";
import AboutUs from "./Components/AboutUs";
import { useLocation } from "react-router";
import ReactGA from "react-ga";
import AllQuestionsSubmissions from "./MyRooms/AllQuestionsSubmissions/AllQuestionsSubmissions";

export default function AuthRouter() {
  const [loading, setLoading] = useState(true);
  const authReducer = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();
  useEffect(() => {
    // console.log('location', location.pathname);
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);

  const handleError = (err) => {
    if (!err.response) {
      enqueueSnackbar(
        "Some Error occurred while getting Rooms. Please refresh page",
        { variant: "error" }
      );
      return;
    }
    if (err.response.status === 401) {
      dispatch(logoutUser());
    } else {
      enqueueSnackbar(
        "Some Error occurred while getting Rooms. Please refresh page",
        { variant: "error" }
      );
    }
  };

  const getMyRoomsData = async () => {
    if (authReducer.accountType === 0) {
      return;
    }
    dispatch(setMyRoomsLoading());
    axios
      .get("/my_rooms")
      .then((res) => {
        dispatch(setMyRooms(res.data.myRooms));
        dispatch(removeMyRoomsLoading());
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const getEnrolledRoomsData = async () => {
    dispatch(setEnrolledLoading());
    axios
      .get("/enrolled_rooms")
      .then((res) => {
        dispatch(setEnrolled(res.data.enrolledRooms));
        dispatch(removeEnrolledLoading());
      })
      .catch((err) => {
        handleError(err);
      });
  };

  useEffect(() => {
    try {
      if (localStorage.JWTtoken) {
        const token = localStorage.getItem("JWTtoken");
        // Decode token and get user info and exp
        const decoded = jwt_decode(token);
        // Set user and isAuthenticated
        // store.dispatch(setCurrentUser(decoded));
        // Check for expired token
        // console.log(decoded)
        const currentTime = Date.now() / 1000; // to get in milliseconds
        if (decoded.exp >= currentTime) {
          const data = {
            isLogged: true,
            userId: decoded.userId,
            userName: decoded.userName,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            accountType: !decoded.accountType ? 0 : decoded.accountType,
          };
          // console.log(data);
          // decoded.isLogged = true;
          dispatch(loginUser(data));
          getEnrolledRoomsData();
          getMyRoomsData();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, []);

  return loading ? (
    <div
      style={{
        fontSize: "40px",
        fontWeight: "bolder",
        color: "var(--secondaryBackground)",
      }}
    >
      Loading .....
    </div>
  ) : !authReducer.isLogged ? (
    <Redirect
      push
      to={{
        pathname: "/login",
        state: {
          from: window.location.href,
        },
      }}
    />
  ) : (
    <>
      <MyNavbar />
      {authReducer.accountType > 0 ? (
        <>
          <Switch>
            <Route exact path="/my_rooms">
              <AllRooms getMyRoomsData={getMyRoomsData} />
            </Route>
            <Route exact path="/my_rooms/:id">
              <OneRoom getMyRoomsData={getMyRoomsData} />
            </Route>
            <Route exact path="/edit_question">
              <EditQuestion />
            </Route>
            <Route exact path="/submissions">
              <CheckSubmissions />
            </Route>
            <Route exact path="/all_submissions">
              <AllQuestionsSubmissions />
            </Route>
            <Route exact path="/join_room">
              <JoinRoom />
            </Route>
            <Route exact path="/enrolled_rooms">
              <AllEnrolled getEnrolledRoomsData={getEnrolledRoomsData} />
            </Route>
            <Route exact path="/enrolled_rooms/:id">
              <EnrolledRoom />
            </Route>
            <Route exact path="/question">
              <ViewQuestion />
            </Route>
            <Route exact path="/code">
              <CodePlayground />
            </Route>
            <Route exact path="/user_settings">
              <UserSettings />
            </Route>
            <Route exact path="/about">
              <AboutUs />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </>
      ) : (
        <>
          <Switch>
            <Route exact path="/join_room">
              <JoinRoom />
            </Route>
            <Route exact path="/enrolled_rooms">
              <AllEnrolled getEnrolledRoomsData={getEnrolledRoomsData} />
            </Route>
            <Route exact path="/enrolled_rooms/:id">
              <EnrolledRoom />
            </Route>
            <Route exact path="/question">
              <ViewQuestion />
            </Route>
            <Route exact path="/code">
              <CodePlayground />
            </Route>
            <Route exact path="/user_settings">
              <UserSettings />
            </Route>
            <Route exact path="/about">
              <AboutUs />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </>
      )}
    </>
  );
}
