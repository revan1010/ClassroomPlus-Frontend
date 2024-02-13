import { Form, Input, Button } from "antd";
import axios from "axios";
import React, { useState } from "react";

import { useSnackbar } from "notistack";

export default function Login() {
  document.title = "Login | ClassRoom Plus";

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const resendEmail = async (key) => {
    closeSnackbar(key);
    setLoading(true);
    await axios
      .get("/auth/resend_verification_link", {
        params: {
          username: userName,
        },
      })
      .then((res) => {
        enqueueSnackbar("Verification link sent.", { variant: "success" });
      })
      .catch((err) => {
        try {
          enqueueSnackbar(err.response.data.detail, {
            variant: "error",
          });
        } catch (error) {
          enqueueSnackbar("Some Error occurred.", {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  const action = (key) => (
    <React.Fragment>
      <>
        <div
          onClick={() => {
            resendEmail(key);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fc28b2",
            paddingRight: "8px",
            textDecoration: "underline",
            fontWeight: "bolder",
          }}
        >
          Resend Email
        </div>
        <div
          onClick={() => {
            closeSnackbar(key);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fc28b2",
            textDecoration: "underline",
            fontWeight: "bolder",
          }}
        >
          Dismiss
        </div>
      </>
    </React.Fragment>
  );

  const onFinish = async (values) => {
    setLoading(true);
    setUserName(values.userName);
    await axios
      .post("/auth/login", {
        username: values.userName,
        password: values.password,
      })
      .then((res) => {
        // console.log(res);
        localStorage.setItem("JWTtoken", res.data.access_token);
        // try {
        //     window.location.href = history.location.state.from;
        // } catch (error) {
        window.location.href = "/";
        // }
      })
      .catch((err) => {
        try {
          if (err.response.status === 406) {
            enqueueSnackbar(err.response.data.detail, {
              variant: "warning",
              persist: true,
              action,
            });
          } else {
            enqueueSnackbar(err.response.data.detail, {
              variant: "error",
            });
          }
        } catch (error) {
          enqueueSnackbar("Some Error occurred.", {
            variant: "error",
          });
        }
      });
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
    try {
      enqueueSnackbar(errorInfo.errorFields[0].errors[0], {
        variant: "error",
      });
    } catch (error) {
      enqueueSnackbar("Some Error occurred.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="login-outer-div">
      <img
        src="./Logo.PNG"
        style={{
          alignSelf: "center",
          width: "250px",
          boxShadow: "20px 20px 2px rgba(0, 0, 0, 0.3)",
        }}
      />
      <div className="login-header-div">Login</div>

      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="login-form"
      >
        <Form.Item
          label={
            <label style={{ color: "var(--primaryText)" }}>
              Username / Email
            </label>
          }
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input your username/email !",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={
            <label style={{ color: "var(--primaryText)" }}>Password</label>
          }
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div>
          <a href="/#/change_password"> Forgot password. </a>
        </div>
        <a href="/#/signup"> Dont have an account ? Create one. </a>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "var(--success)",
              // width: "100px",
              fontSize: "20px",
              height: "auto",
              marginTop: "10px",
            }}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
