import React, { useState } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function ChangePassword() {
  document.title = "Reset Password | ClassRoom Plus";

  const [loading, setLoading] = useState(false);
  const [showPasswordAndOTP, setShowPasswordAndOTP] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();

  const requestOTP = async (email) => {
    setLoading(true);
    await axios
      .get("/auth/request_change_password", {
        params: {
          email: email,
        },
      })
      .then((res) => {
        setShowPasswordAndOTP(true);
        enqueueSnackbar("OTP has been sent to " + email, {
          variant: "success",
        });
      })
      .catch((err) => {
        if (!err.response) {
          enqueueSnackbar("Some Error occurred.", {
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

  const changePassword = async (values) => {
    setLoading(true);
    await axios
      .post("/auth/change_password", {
        email: values.email,
        password: values.password,
        otp: values.otp,
      })
      .then((res) => {
        enqueueSnackbar("Password changed", {
          variant: "success",
        });
        history.replace("/login");
      })
      .catch((err) => {
        if (!err.response) {
          enqueueSnackbar("Some Error occurred.", {
            variant: "error",
          });
          return;
        }
        enqueueSnackbar(err.response.data.detail, {
          variant: "error",
        });
      });
    setLoading(false);
  };

  const onFinish = async (values) => {
    if (!values.otp) {
      requestOTP(values.email);
    } else {
      if (values.password !== values.rePassword) {
        enqueueSnackbar("Passwords do not match!", {
          variant: "error",
        });
        setLoading(false);
        return;
      }
      changePassword(values);
    }
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
      <div className="signup-header-div">Change password</div>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{
          layout: "vertical",
        }}
        onFinish={onFinish}
        autoComplete="off"
        className="signup-form"
      >
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
              },
            ]}
          >
            <Input readOnly={showPasswordAndOTP} />
          </Form.Item>
        </div>
        {showPasswordAndOTP ? (
          <>
            <Form.Item
              label={<label style={{ color: "var(--primaryText)" }}>OTP</label>}
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Invalid OTP !",
                },
                {
                  pattern: new RegExp("^[0-9]{6}$"),
                  message: "Invalid OTP !",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
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
                    message: "Please input your password!",
                  },
                  {
                    message: "Invalid Password!",
                    pattern: new RegExp(
                      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^#&:;<>(){},.?~_|]).{5,}$"
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
            <span style={{ color: "red" }}>Do not refresh this page.</span>
          </>
        ) : (
          <></>
        )}
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
              // fontSize: "20px",
              height: "auto",
              marginRight: "130px",
              marginTop: "20px",
            }}
            loading={loading}
          >
            {showPasswordAndOTP ? "Change Password" : "Get OTP"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
