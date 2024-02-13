import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../Redux/Actions/RoomsDataActions";
import { Card, Avatar, Tooltip } from "antd";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { SiGmail } from "react-icons/si";
import { GoGlobe } from "react-icons/go";
import ScrollToTop from "react-scroll-to-top";

const { Meta } = Card;

export default function AboutUs() {
  const dispatch = useDispatch();
  document.title = "About Us | Code Rooms";

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "About Us",
          url: "/about",
        },
      ])
    );
  }, []);

  return (
    <div className="aboutus-outer">
      <ScrollToTop
        smooth
        style={{ paddingTop: "5px" }}
        color="var(--primaryBackground)"
      />
      <div className="aboutus-inner">
        <img
          onClick={() => {
            window.location.href = "/#/";
          }}
          src="./Logo.PNG"
          style={{
            alignSelf: "center",
            width: "250px",
            boxShadow: "20px 20px 2px rgba(0, 0, 0, 0.3)",
            marginBottom: "15px",
          }}
        />
        <div className="aboutus-title">
          <u> About Us </u>
        </div>

        <div className="aboutus-cards">
          <Card
            style={{ width: 300 }}
            cover={
              <img
                alt="Shlok"
                src="https://avatars.githubusercontent.com/u/63449205?v=4"
              />
            }
            actions={[
              <a
                href="https://github.com/Shlok-Zanwar?tab=repositories"
                target="_blank"
              >
                <BsGithub className="aboutus-card-icons" key="github" />
              </a>,
              <a href="https://shlok-zanwar.github.io/" target="_blank">
                <GoGlobe className="aboutus-card-icons" key="website" />
              </a>,
              <a
                href="https://www.linkedin.com/in/shlok-zanwar-0124961ba/"
                target="_blank"
              >
                <BsLinkedin className="aboutus-card-icons" key="linkedin" />
              </a>,
              <Tooltip title="shlokzanwar14@gmail.com">
                <a href="mailto:shlokzanwar14@gmail.com" target="_blank">
                  <SiGmail className="aboutus-card-icons" key="gmail" />
                </a>
              </Tooltip>,
            ]}
          >
            <Meta
              title="Shlok Zanwar"
              description={
                <span>
                  <div style={{ textAlign: "left", marginBottom: "15px" }}>
                    (TY CS B-Tech) Student at vishwakarma institute of
                    information technology, pune.
                  </div>
                  <div style={{ textAlign: "left" }}>
                    Quick learner, Proactive
                  </div>
                  <div style={{ textAlign: "left" }}>Tech enthusiast</div>
                </span>
              }
            />
          </Card>
        </div>
        <div className="aboutus-cards">
          <Card
            style={{ width: 300 }}
            cover={<img alt="Roshan" src="https://i.ibb.co/K6cpBDW/img.jpg" />}
            actions={[
              <a href="https://github.com/roshanpurohit" target="_blank">
                <BsGithub className="aboutus-card-icons" key="github" />
              </a>,
              <a
                href="https://www.linkedin.com/in/roshan-purohit-87389b1a7"
                target="_blank"
              >
                <BsLinkedin className="aboutus-card-icons" key="linkedin" />
              </a>,
              <Tooltip title="roshpurohit24@gmail.com">
                <a href="mailto:roshpurohit24@gmail.com" target="_blank">
                  <SiGmail className="aboutus-card-icons" key="gmail" />
                </a>
              </Tooltip>,
            ]}
          >
            <Meta
              title="Roshan Purohit"
              description={
                <span>
                  <div style={{ textAlign: "left", marginBottom: "15px" }}>
                    (TY CS B-Tech) Student at vishwakarma institute of
                    information technology, pune.
                  </div>
                  <div style={{ textAlign: "left" }}>Ardent problem solver</div>
                  <div style={{ textAlign: "left" }}>Web dev enthusiast</div>
                </span>
              }
            />
          </Card>
        </div>
        <div className="aboutus-cards">
          <Card
            style={{ width: 300 }}
            cover={
              <img alt="Roshan" src="https://i.ibb.co/ssQVy57/Parag.jpg" />
            }
            actions={[
              <a href="https://github.com/parag-2804" target="_blank">
                <BsGithub className="aboutus-card-icons" key="github" />
              </a>,
              <a
                href="https://www.linkedin.com/in/parag-jadhav-0205a5215/"
                target="_blank"
              >
                <BsLinkedin className="aboutus-card-icons" key="linkedin" />
              </a>,
              <Tooltip title="parag2804@gmail.com">
                <a href="mailto:parag2804@gmail.com" target="_blank">
                  <SiGmail className="aboutus-card-icons" key="gmail" />
                </a>
              </Tooltip>,
            ]}
          >
            <Meta
              title="Parag Jadhav"
              description={
                <span>
                  <div style={{ textAlign: "left", marginBottom: "15px" }}>
                    (TY CS B-Tech) Student at vishwakarma institute of
                    information technology, pune.
                  </div>
                </span>
              }
            />
          </Card>
        </div>

        <div className="aboutus-content">
          <p>
            <span style={{ color: "var(--tertiaryBackground)" }}>
              Code rooms is a learning management system where teachers can
              seamlessly create rooms,assignments and assess assignments.
              Students can easily submit assigned assignments.
            </span>
            <br />
            <br />
            <u>Cool Features:</u>
            <div className="aboutus-list">
              <ul>
                <li>
                  Create Rooms with features like waiting room authority and
                  visibility on the go with one click.
                </li>
                <li>
                  Questions can be made in rooms with submission info and edit
                  options right on the card.
                </li>
                <li>
                  Create questions on the go with side by side expected user
                  preview on the left with all editable components on right in
                  resizable panels.
                </li>
                <li>Questions can be of code or file submission type.</li>
                <li>
                  Code type questions have option to add testcases which will be
                  processed on submissions.
                </li>
                <li>
                  Question settings like End time and visibility can be edited
                  anytime.
                </li>
                <li>Question due time on question cards itself.</li>
                <li>
                  Code type questions can be submitted with user friendly
                  resizable code editor with options like run with entered
                  input, save current code and submit.
                </li>
                <li>
                  File type questions let you upload the file with a preview
                  before submitting
                </li>
                <li>
                  Submissions of any type of question can be assessed easily in
                  every question with a code editor with submitted code or a
                  preview of the file submitted right on the screen with
                  download option.
                </li>
                <li>
                  Easy navigation throughout the application with features like
                  breadcrumbs.
                </li>
              </ul>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}
