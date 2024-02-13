import "./App.css";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Authentication/Login";
import AuthRouter from "./AuthRouter";
import VerifyEmail from "./Authentication/VerifyEmail";
import Signup from "./Authentication/Signup";
import ChangePassword from "./Authentication/ChangePassword";
import AboutUs from "./Components/AboutUs";
import { useEffect } from "react";
// import "antd/dist/antd.css";

export default function App() {
  // useEffect(() => {
  // 	// chekin if the device is mobile and if so turning on desktop mode
  // 	const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  // 	if(isMobile){
  // 		document.getElementsByTagName('meta')['viewport'].content='width= 1024;';
  // 	}
  // 	else{
  // 		document.getElementsByTagName('meta')['viewport'].content='width=device-width, initial-scale=1';
  // 	}

  // }, []);

  return (
    <Router basename="/">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/verify_email">
          <VerifyEmail />
        </Route>
        <Route path="/change_password">
          <ChangePassword />
        </Route>

        <Route path="/">
          {/* {
                        localStorage.getItem('redirectTo') ? <Redirect to={localStorage.getItem('redirectTo')} /> 
                        : null
                        
                    } */}
          <AuthRouter />
        </Route>
      </Switch>
    </Router>
  );
}
