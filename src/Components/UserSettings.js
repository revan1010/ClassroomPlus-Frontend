import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { RiUser6Line } from "react-icons/ri";
import { FiUserCheck } from "react-icons/fi";
import { Form, Input, Button, Tabs, Tooltip } from "antd";
import { AiOutlineMail } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { loginUser } from "../Redux/Actions/AuthActions";
import { setBreadcrumb } from "../Redux/Actions/RoomsDataActions";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

export default function UserSettings() {
  const [loading, setLoading] = useState(false);
  const authReducer = useSelector((state) => state.authReducer);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Settings",
          url: "/user_settings",
        },
      ])
    );
  }, []);

  document.title = "User Settings | ClassRoom Plus";

  const submitAccountType = async (values) => {
    setLoading(true);
    await axios
      .post("/auth/change_account_type", {
        userName: values.userName,
        accountType: values.accountType,
      })
      .then((res) => {
        //  localStorage.setItem("JWTtoken", res.data.access_token);
        //  const decoded = jwt_decode(res.data.access_token);
        //  const data = {
        //    isLogged: true,
        //    userId: decoded.userId,
        //    userName: decoded.userName,
        //    firstName: decoded.firstName,
        //    lastName: decoded.lastName,
        //    email: decoded.email,
        //  };
        //  dispatch(loginUser(data));
        enqueueSnackbar("User Account changed ", {
          variant: "success",
        });
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response) {
          enqueueSnackbar("Some error while changing Account!", {
            variant: "error",
          });
          setLoading(false);
          return;
        }
        if (err.response.status === 401) {
          enqueueSnackbar(err.response.data.detail, {
            variant: "error",
          });
          history.replace("/login");
        } else {
          enqueueSnackbar(err.response.data.detail, {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  const submitUsername = async (values) => {
    if (authReducer.userName === values.userName) {
      enqueueSnackbar("Username unchanged !", { variant: "info" });
      return;
    }
    setLoading(true);

    await axios
      .post("/auth/change_username", {
        userName: values.userName,
      })
      .then((res) => {
        localStorage.setItem("JWTtoken", res.data.access_token);
        const decoded = jwt_decode(res.data.access_token);
        const data = {
          isLogged: true,
          userId: decoded.userId,
          userName: decoded.userName,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
        };
        dispatch(loginUser(data));
        enqueueSnackbar("Username changed to " + decoded.userName, {
          variant: "success",
        });
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response) {
          enqueueSnackbar("Some error while changing username!", {
            variant: "error",
          });
          setLoading(false);
          return;
        }
        if (err.response.status === 401) {
          enqueueSnackbar(err.response.data.detail, {
            variant: "error",
          });
          history.replace("/login");
        } else {
          enqueueSnackbar(err.response.data.detail, {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  return (
    <Tabs
      defaultActiveKey={"userInfo"}
      tabBarExtraContent={
        <Link to="/change_password" style={{ marginRight: "20px" }}>
          <Button disabled={loading} danger>
            Change Password
          </Button>
        </Link>
      }
      destroyInactiveTabPane={true}
    >
      <TabPane
        tab={
          <div
            className="myRooms-cards-description"
            style={{ fontSize: "15px" }}
          >
            <FiUserCheck />
            <span style={{ margin: "0px 6px", display: "inline-flex" }}>
              Details
            </span>
          </div>
        }
        key="userInfo"
        style={{ textAlign: "left" }}
        disabled={loading}
      >
        <div
          className="myRooms-cards-box"
          style={{ padding: "5px 0px 0px 0px" }}
        >
          <div className="myRooms-cards-info">
            <div className="myRooms-cards-description">
              <RiUser6Line />
              <span
                style={{
                  marginLeft: "10px",
                  display: "inline-flex",
                  minWidth: "150px",
                }}
              >
                Name
              </span>
              {authReducer.firstName + " " + authReducer.lastName}
            </div>
            <div className="myRooms-cards-description">
              <AiOutlineMail />
              <span
                style={{
                  marginLeft: "10px",
                  display: "inline-flex",
                  minWidth: "150px",
                }}
              >
                Email
              </span>
              {authReducer.email}
            </div>
            <div className="myRooms-cards-description">
              <FiUserCheck />
              <span
                style={{
                  marginLeft: "10px",
                  display: "inline-flex",
                  minWidth: "150px",
                }}
              >
                Username
              </span>
              {authReducer.userName}
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane
        tab={
          <div
            className="myRooms-cards-description"
            style={{ fontSize: "15px", padding: "0px", margin: "0px" }}
          >
            <FiUserCheck />

            <span style={{ margin: "0px 6px", display: "inline-flex" }}>
              Change Username
            </span>
          </div>
        }
        key="changeUsername"
        destroyInactiveTabPane={true}
      >
        <div
          className="signup-input-left"
          style={{ maxWidth: "400px", marginLeft: "20px" }}
        >
          <Form
            name="basic"
            onFinish={submitUsername}
            layout="vertical"
            initialValues={{
              layout: "vertical",
            }}
            autoComplete="off"
            className="signup-form"
          >
            <Form.Item
              label={
                <label style={{ color: "var(--primaryText)" }}>
                  <span style={{ paddingRight: "5px" }}>Username</span>
                  <Tooltip title="Username must start with a capital letter, have minimum of 3 characters and should not exceed 15 characters. No special charecters except '_' allowed.">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </label>
              }
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Please input valid username to set!",
                },
                {
                  pattern: new RegExp("^[A-Z][a-z0-9_-]{2,15}$"),
                  message: "Invalid username",
                },
              ]}
            >
              <Input disabled={loading} defaultValue={authReducer.userName} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary" loading={loading}>
                {loading ? "Submitting" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </TabPane>

      {/* ----------------------------------------------------------- */}
      {authReducer.accountType == 7 ? (
        <>
          <TabPane
            tab={
              <div
                className="myRooms-cards-description"
                style={{ fontSize: "15px", padding: "0px", margin: "0px" }}
              >
                <FiUserCheck />

                <span style={{ margin: "0px 6px", display: "inline-flex" }}>
                  Change Account Type
                </span>
              </div>
            }
            key="changeAccountType"
            destroyInactiveTabPane={true}
          >
            {/* ----------------------------------------------------------- */}

            <div
              className="signup-input-left"
              style={{ maxWidth: "400px", marginLeft: "20px" }}
            >
              <Form
                name="basic"
                onFinish={submitAccountType}
                layout="vertical"
                initialValues={{
                  layout: "vertical",
                }}
                autoComplete="off"
                className="signup-form"
              >
                <Form.Item
                  label={
                    <label style={{ color: "var(--primaryText)" }}>
                      <span style={{ paddingRight: "5px" }}>Username</span>
                      <Tooltip title="Username must start with a capital letter, have minimum of 3 characters and should not exceed 15 characters. No special charecters except '_' allowed.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </label>
                  }
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "Please input valid userID to set!",
                    },
                    {
                      pattern: new RegExp("^[A-Z][a-z0-9_-]{2,15}$"),
                      message: "Invalid username",
                    },
                  ]}
                >
                  <Input disabled={loading} defaultValue={""} />
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ color: "var(--primaryText)" }}>
                      <span style={{ paddingRight: "5px" }}>Account Type</span>
                      {/* <Tooltip title="Username must start with a capital letter, have minimum of 3 characters and should not exceed 15 characters. No special charecters except '_' allowed.">
                    <QuestionCircleOutlined />
                  </Tooltip> */}
                    </label>
                  }
                  name="accountType"
                  rules={[
                    {
                      required: true,
                      message: "Please input valid user Account Type to set!",
                    },
                    {
                      pattern: new RegExp("^[0-9]$"),
                      message: "Invalid AccountType",
                    },
                  ]}
                >
                  <Input disabled={loading} defaultValue={""} />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary" loading={loading}>
                    {loading ? "Submitting" : "Submit"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </>
      ) : (
        " "
      )}
    </Tabs>
  );
}
