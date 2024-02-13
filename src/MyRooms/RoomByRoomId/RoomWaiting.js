import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { TransverseLoading } from "react-loadingg";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function RoomWaiting({ roomInfo, setRoomInfo, waitingTable, setWaitingTable, enrolledTable, setEnrolledTable }) {
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        var searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });

                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(async () => {
        await axios.get(`/room_waiting_members/${roomInfo.roomId}`)
            .then(res => {
                setWaitingTable(res.data.members);
                setLoading(false);
            })
            .catch(err => {
                enqueueSnackbar("Some Error occurred while getting room members.", { variant: "error" });
            });
    }, []);

    const deleteMember = async (userId, tableId) => {
        // alert(userId);
        setTableLoading(true);
        await axios.post("/reject_room_member", {
                roomId: roomInfo.roomId,
                userId: userId,
        })
            .then(res => {
                setWaitingTable(waitingTable.filter(data => data.tableId !== tableId));
                var newRoomInfo = { ...roomInfo };
                newRoomInfo.waitingRoomCount -= 1;
                setRoomInfo(newRoomInfo);
            })
            .catch(err => {
                try {
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                } catch (error) {
                    enqueueSnackbar("Couldn't delete user.", { variant: "error" });
                }
            });
        setTableLoading(false);
    };

    const acceptMember = async (userId, tableId) => {
        // alert(userId);
        setTableLoading(true);
        await axios.post("/accept_room_member", {
            roomId: roomInfo.roomId,
            userId: userId,
        })
            .then(res => {
                setEnrolledTable([...enrolledTable, (waitingTable.filter(data => data.tableId === tableId))[0] ]);
                setWaitingTable(waitingTable.filter(data => data.tableId !== tableId));
                var newRoomInfo = { ...roomInfo };
                newRoomInfo.enrolled += 1;
                newRoomInfo.waitingRoomCount -= 1;
                setRoomInfo(newRoomInfo);
                // console.log(waitingTable);
            })
            .catch(err => {
                // console.log(err);
                try {
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                } catch (error) {
                    enqueueSnackbar("Couldn't delete user.", { variant: "error" });
                }
            });
        setTableLoading(false);
    };

    const columns = [
        {
            title: "Username",
            dataIndex: "userName",
            key: "userName",
            ...getColumnSearchProps("userName"),
            // sorter: (a, b) => a.device_code.length - b.device_code.length,
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            // sorter: (a, b) => a.device_code.length - b.device_code.length,
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
            // sorter: (a, b) => a.device_code.length - b.device_code.length,
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "SpecialFields",
            children: roomInfo.specialFields.map((field, index) => {
                return{
                    title: field,
                    // dataIndex: field,
                    key: field,
                    render: row => (row.specialFields[index]),
                    sorter: (a, b) => a.specialFields[index] - b.specialFields[index],
                    sortDirections: ["descend", "ascend"],

                }
            }),
            hidden: roomInfo.specialFields.length === 0,
        },
        {
            title: "Actions",
            key: "actions",
            width: "200px",
            render: row => (
                <>
                    <Button onClick={() => {acceptMember(row.userId, row.tableId);}} style={{marginRight: '15px'}}>
                        Accept
                    </Button>
                    <Popconfirm
                        title={
                            <>
                                Are you sure you want to remove {row.name} ?
                            </>
                        }
                        onConfirm={() => {deleteMember(row.userId, row.tableId);}}
                        okText="Yes"
                        cancelText="Cancel"
                        overlayInnerStyle={{
                            maxWidth: "440px",
                            backgroundColor: "var(--primaryBackground)",
                            border: "2px solid var(--primaryText)",
                        }}
                    >
                        <Button danger={true}>Remove</Button>
                    </Popconfirm>
                </>
            ),
        },
    ].filter(item => !item.hidden);

    return loading ? (
        <div style={{ position: "relative", height: "120px", fontSize: "25px" }}>
            <span style={{ marginBottom: "100px" }}>Loading ...</span>
            <span>
                <TransverseLoading color="var(--loadingColor)" size="large" />
            </span>
        </div>
    ) : (
        <div>
            <Table 
                loading={tableLoading} 
                columns={columns} 
                dataSource={waitingTable} 
                size="small" 
                pagination={false} 
            />
        </div>
    );
}
