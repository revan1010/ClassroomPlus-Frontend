import React, { useState } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function Signup() {
  document.title = "Sign Up | ClassRoom Plus";

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    if (values.password !== values.rePassword) {
      enqueueSnackbar("Passwords do not match!", {
        variant: "error",
      });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }
    await axios
      .post("/auth/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        username: values.userName,
      })
      .then((res) => {
        enqueueSnackbar(
          "Verification link has been sent to " +
            values.email +
            ". Please verify your account.",
          {
            variant: "success",
          }
        );
        setLoading(false);
        history.push("/login");
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
        setLoading(false);
      });
  };
  return (
    <div className="signup-outer-div">
      <img
        src="./Logo.PNG"
        style={{
          alignSelf: "center",
          width: "250px",
          boxShadow: "20px 20px 2px rgba(0, 0, 0, 0.3)",
        }}
      />
      <div className="signup-header-div">Sign Up</div>
      <Form
        name="basic"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
          layout: "vertical",
        }}
        autoComplete="off"
        className="signup-form"
      >
        <div className="signup-input-sameline">
          <Form.Item
            label={
              <label style={{ color: "var(--primaryText)" }}>First Name</label>
            }
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your First Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <label style={{ color: "var(--primaryText)" }}>Last Name</label>
            }
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your Last Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="signup-input-left">
          <Form.Item
            label={<label style={{ color: "var(--primaryText)" }}>Email</label>}
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email address!",
              },
              {
                type: "email",
                warningOnly: true,
                message: "Input is not a valid email address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
                message: "Please input username to set!",
              },
              {
                pattern: new RegExp("^[A-Z][a-z0-9_-]{2,15}$"),
                message: "Invalid username",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="signup-input-sameline">
          <Form.Item
            label={
              <label style={{ color: "var(--primaryText)" }}>
                <span style={{ paddingRight: "5px" }}>Password</span>
                <Tooltip title="Password must contain ATLEAST one uppercase character, one lowercase character, one numeric character, one special character and should have length of 5 to 15 characters.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </label>
            }
            name="password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
              {
                message: "Invalid Password!",
                pattern: new RegExp(
                  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^#&:;<>(){},.?~_|]).{5,15}$"
                ),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={
              <label style={{ color: "var(--primaryText)" }}>
                Re-Enter Password
              </label>
            }
            name="rePassword"
            rules={[
              {
                required: true,
                message: "Please re-enter your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </div>
        <a href="/#/login"> Already have an account? Log in. </a>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            htmlType="submit"
            style={{
              backgroundColor: "var(--success)",
              width: "auto",
              fontSize: "20px",
              height: "auto",
              marginRight: "130px",
              marginTop: "20px",
            }}
            loading={loading}
          >
            {loading ? "Submitting" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
