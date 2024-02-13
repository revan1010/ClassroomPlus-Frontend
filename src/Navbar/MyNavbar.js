import React from "react";
import NavbarDrawer from "./NavbarDrawer";
import { Breadcrumb, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MyNavbar() {
  const roomsDataReducer = useSelector((state) => state.roomsDataReducer);

  return (
    <div className="navbar-outer-div">
      <div style={{ display: "inline-flex" }}>
        <NavbarDrawer />
        <Breadcrumb
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "20px",
            fontSize: "18px",
          }}
        >
          <Breadcrumb.Item href="">
            <Link to="/">
              {/* <HomeOutlined style={{fontSize: '16px'}} /> */}
              <span style={{ marginLeft: "3px" }}>Home</span>
            </Link>
          </Breadcrumb.Item>

          {roomsDataReducer.breadcrumb.map((page) => (
            <Breadcrumb.Item href="">
              <Link to={page.url}>
                <span style={{ marginLeft: "3px" }}>{page.name}</span>
              </Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="classroomplus@gmail.com">
          <div
            style={{
              fontSize: "25px",
              margin: "0px 20px",
              fontStyle: "italic",
              cursor: "pointer",
            }}
          >
            Classroom Plus
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
