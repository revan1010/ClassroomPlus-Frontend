import React, { useEffect, useState } from "react";

import { PointSpreadLoading } from "react-loadingg";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import { useSnackbar } from "notistack";

export default function VerifyEmail() {
  document.title = "Verify Email | ClassRoom Plus";

  const [countdown, setCountdown] = useState(10);
  const [result, setResult] = useState("");
  const [statusColor, setStatusColor] = useState("#ff1c03");

  const queryParams = new URLSearchParams(useLocation().search);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(async () => {
    if (countdown <= 0) {
      // window.location.href = "/login"
      history.replace("/login");
    }

    if (result === "") {
      if (!queryParams.has("email") || !queryParams.has("otp")) {
        setResult("Invalid Credentials");
        enqueueSnackbar("Some Error occurred", {
          variant: "error",
        });
      } else {
        await axios
          .post("/auth/verify_email", {
            email: queryParams.get("email"),
            otp: queryParams.get("otp"),
          })
          .then((res) => {
            enqueueSnackbar("Email Verified", {
              variant: "success",
            });
            setResult("Email id " + queryParams.get("email") + " Verified");
            setStatusColor("#46ed1c");
          })
          .catch((err) => {
            try {
              setResult(err.response.data.detail);
            } catch (error) {
              setResult("Some Error Occured");
            }
            enqueueSnackbar("Some Error occurred", {
              variant: "error",
            });
          });
      }
    }

    setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
  }, [countdown]);

  return (
    <div className="VerifyEmail-outer-div">
      <div className="VerifyEmail-heading-div">
        Verifying Details with Server ...
      </div>
      {result === "" ? (
        <div style={{ marginTop: "20px", position: "relative" }}>
          <PointSpreadLoading color="var(--loadingColor)" />
        </div>
      ) : (
        <div className="verifyEmail-status-div">
          <div>
            Status : <span style={{ color: statusColor }}>{result}</span>
          </div>
          <div>
            Redirecting to{" "}
            <span>
              <a href="/#/login">login</a>
            </span>{" "}
            page in {countdown} seconds
          </div>
        </div>
      )}
    </div>
  );
}
