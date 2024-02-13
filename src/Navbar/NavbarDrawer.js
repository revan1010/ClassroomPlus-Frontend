import { useState } from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Tooltip } from "antd";
import { BsPersonSquare } from "react-icons/bs";
import { VscVersions } from "react-icons/vsc";
import {
  MenuOutlined,
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleFilled,
  LogoutOutlined,
  BookOutlined,
  PlusCircleOutlined,
  CodeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { logoutUser } from "../Redux/Actions/AuthActions";
import { useHistory } from "react-router-dom";
import MyDivider from "../Components/MyDivider";

const { SubMenu } = Menu;

export default function NavbarDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const authReducer = useSelector((state) => state.authReducer);
  const roomsDataReducer = useSelector((state) => state.roomsDataReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const openDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const pushLink = (link) => {
    setDrawerOpen(false);
    history.push(link);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <MenuOutlined
        style={{ fontSize: "25px", color: "var(--primaryText)" }}
        onClick={openDrawer}
      />

      <Drawer
        title={
          <Tooltip
            title={
              authReducer.accountType > 0
                ? "Teacher account"
                : "Student account"
            }
            placement="bottomLeft"
          >
            <div
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <BsPersonSquare
                style={{ fontSize: "20px", marginRight: "20px" }}
              />
              <div style={{ fontSize: "20px" }}>{authReducer.userName}</div>
            </div>
          </Tooltip>
        }
        footer={
          <Menu
            style={{ background: "var(--primaryBackground)" }}
            mode="vertical"
            theme="dark"
            selectable={false}
          >
            <MyDivider />
          </Menu>
        }
        keyboard={true}
        placement="left"
        closable={false}
        onClose={closeDrawer}
        visible={drawerOpen}
        key="left"
        bodyStyle={{
          backgroundColor: "var(--primaryBackground)",
          padding: "0px",
        }}
        headerStyle={{
          backgroundColor: "var(--primaryBackground)",
          height: "61px",
          borderBottom: "2px solid var(--primaryText)",
        }}
        footerStyle={{
          backgroundColor: "var(--primaryBackground)",
          borderTop: "None",
          padding: "0px",
          // fontSize: "18px",
        }}
        defaultSelectedKeys={["home"]}
        defaultOpenKeys={["home"]}
      >
        <Menu
          style={{ background: "var(--primaryBackground)" }}
          mode="vertical"
          theme="dark"
          selectable={false}
        >
          <Menu.Item
            key="home"
            className="navbar-drawer-item"
            icon={<HomeOutlined />}
            onClick={() => {
              pushLink(`/`);
            }}
          >
            Home
          </Menu.Item>

          <MyDivider />

          <SubMenu
            icon={<BookOutlined />}
            title="Enrolled Rooms"
            key="sub1"
            onTitleClick={() => {
              pushLink(`/enrolled_rooms`);
            }}
          >
            {roomsDataReducer.enrolledRoomsLoading ? (
              <Menu.Item>Loading .....</Menu.Item>
            ) : roomsDataReducer.enrolledRooms.length === 0 ? (
              <Menu.Item>No Rooms</Menu.Item>
            ) : (
              roomsDataReducer.enrolledRooms.map((room) => (
                <Menu.Item
                  key={room.roomId}
                  onClick={() => {
                    pushLink(`/enrolled_rooms/${room.roomId}`);
                  }}
                >
                  {room.roomName}
                </Menu.Item>
              ))
            )}
          </SubMenu>

          {authReducer.accountType > 0 ? (
            <>
              <MyDivider />

              <SubMenu
                icon={<AppstoreOutlined />}
                title="My Rooms"
                key="sub2"
                onTitleClick={() => {
                  pushLink(`/my_rooms`);
                }}
              >
                {roomsDataReducer.myRoomsLoading ? (
                  <Menu.Item>Loading .....</Menu.Item>
                ) : roomsDataReducer.myRooms.length === 0 ? (
                  <Menu.Item>No Rooms</Menu.Item>
                ) : (
                  roomsDataReducer.myRooms.map((room) => (
                    <Menu.Item
                      key={room.roomId}
                      onClick={() => {
                        pushLink(`/my_rooms/${room.roomId}`);
                      }}
                    >
                      {room.roomName}
                    </Menu.Item>
                  ))
                )}

                <MyDivider />

                <Menu.Item
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    pushLink("/my_rooms?createNewRoom=true");
                  }}
                >
                  Create New
                </Menu.Item>
              </SubMenu>
            </>
          ) : (
            <></>
          )}

          <MyDivider />

          <Menu.Item
            icon={<CodeOutlined />}
            key="code"
            onClick={() => {
              pushLink("/code");
            }}
          >
            Code Playground
          </Menu.Item>

          <MyDivider />

          <Menu.Item
            icon={<SettingOutlined />}
            key="settings"
            onClick={() => {
              pushLink("/user_settings");
            }}
          >
            Settings
          </Menu.Item>

          <MyDivider />

          {/* <Menu.Item
            icon={<InfoCircleFilled />}
            key="about"
            onClick={() => {
              pushLink("/about");
            }}
          >
            About
          </Menu.Item>

          <MyDivider /> */}

          <Menu.Item
            icon={<LogoutOutlined />}
            key="logout"
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>

          <MyDivider />
        </Menu>
      </Drawer>
    </div>
  );
}
