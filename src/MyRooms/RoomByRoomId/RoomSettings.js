import React, { useDebugValue, useState } from "react";
import { Modal, Button, Input, Form, Switch, Select, Divider, Tooltip } from "antd";
import axios from "axios";
import { setMyRooms } from "../../Redux/Actions/RoomsDataActions";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { BsFillQuestionDiamondFill } from "react-icons/bs";

export default function RoomSettings({ settingsVisible, setSettingsVisible, roomInfo, setRoomInfo }) {
    const [loading, setLoading] = useState(false);
    const [specialFields, setSpecialFields] = useState(roomInfo.specialFields || []);

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const onFinish = values => {
        console.log(values);
        handleSave(values);
    };

    const handleSave = async newData => {
        setLoading(true);
        await axios.post("/update_room_settings", {
            roomId: roomInfo.roomId,
            roomName: newData.roomName === undefined ? roomInfo.roomName : newData.roomName,
            visibility: newData.visibility === undefined ? roomInfo.visibility : newData.visibility,
            waitingRoomEnabled: newData.waitingRoomEnabled === undefined ? roomInfo.waitingRoomEnabled : newData.waitingRoomEnabled,
            specialFields: specialFields,
        })
            .then(res => {
                // console.log(res);
                dispatch(setMyRooms(res.data.myRooms));
                var newRoomInfo = { ...roomInfo };
                newRoomInfo.roomName = res.data.roomInfo.roomName;
                newRoomInfo.visibility = res.data.roomInfo.visibility;
                newRoomInfo.waitingRoomEnabled = res.data.roomInfo.waitingRoomEnabled;
                newRoomInfo.enrolled = res.data.roomInfo.enrolled;
                setRoomInfo(newRoomInfo);
                setSettingsVisible(false);
                enqueueSnackbar("Settings Updated", { variant: "success" });
            })
            .catch(err => {
                // console.log(err);
                enqueueSnackbar("Error while updating Settings", { variant: "error" });

            });
        setLoading(false);
    };

    const handleCancel = () => {
        setSettingsVisible(false);
    };

    const changeSpecialField = (e, index) => {
        const newData = [...specialFields];
        newData[index] = e.target.value;
        setSpecialFields(newData);
    };
    const removeField = index => {
        const newData = specialFields.filter((field, i) => index !== i);
        setSpecialFields(newData);
    };

    const addField = () => {
        const newData = [...specialFields];
        newData.push("New Field");
        setSpecialFields(newData);
    };

    return (
        <Modal
            title={<div className="myRooms-header">Settings</div>}
            visible={settingsVisible}
            destroyOnClose={true}
            onCancel={handleCancel}
            style={{ Radius: "20px" }}
            footer={null}
        >
            <Form layout="horizontal" onFinish={onFinish}>
                <Form.Item name="roomName" labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Room Name" labelAlign="right">
                    <Input defaultValue={roomInfo.roomName} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 10 }}
                    labelCol={{ span: 5 }}
                    label="Visibility"
                    name="visibility"
                    labelAlign="right"
                >
                    <Select defaultValue={roomInfo.visibility}>
                        {/* <Select.Option value="public">Public</Select.Option> */}
                        <Select.Option value="private">Private</Select.Option>
                        <Select.Option value="hidden">Hidden</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 2 }} label="Waiting room" name="waitingRoomEnabled">
                    <Switch defaultChecked={roomInfo.waitingRoomEnabled} />
                </Form.Item>

                <Divider />

                <div
                    style={{
                        fontSize: "23px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "10px",
                    }}
                >
                    <div>
                        <span style={{ marginRight: "10px" }}>Special Fields</span>
                        <Tooltip title="Special Field take extra inputs from user to identify them better. It can only be used when there are 0 users enrolled.">
                            <BsFillQuestionDiamondFill />
                        </Tooltip>
                    </div>
                    <div>
                        <Button onClick={addField} hidden={roomInfo.enrolled > 0 || roomInfo.waitingRoomCount > 0}>
                            Add
                        </Button>
                    </div>
                </div>

                {roomInfo.enrolled > 0 || roomInfo.waitingRoomCount > 0 ? 
                    <span></span> :
                    <span style={{color: 'var(--error)'}}> Note !! Name, email and username are already collected .. </span>
                }

                {specialFields.length === 0 ? <span>No fields</span> : <></> }

                {specialFields.map((field, index) => (
                    <div style={{ margin: "10px" }}>
                        <div style={{ display: "inline-flex" }}>
                            <Input
                                value={field}
                                onChange={e => {
                                    changeSpecialField(e, index);
                                }}
                                readOnly={roomInfo.enrolled > 0 || roomInfo.waitingRoomCount > 0}
                            />
                            <Button
                                onClick={() => {
                                    removeField(index);
                                }}
                                danger={true}
                                style={{ marginLeft: "10px" }}
                                hidden={roomInfo.enrolled > 0 || roomInfo.waitingRoomCount > 0}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}

                <Divider />
                <Button htmlType="submit" type="primary" disabled={loading}>
                    {loading ? "Loading ..." : "Save and Close"}
                </Button>
            </Form>

        </Modal>
    );
}
