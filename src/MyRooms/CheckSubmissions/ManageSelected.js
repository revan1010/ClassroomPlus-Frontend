import React, { useState } from "react";
import { Table, Button, Input, Space, Modal } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { useSnackbar } from "notistack";
import moment from "moment";
import { SiMicrosoftexcel } from "react-icons/si";

export default function ManageSelected({ questionDetails, roomDetails, enrolled, setEnrolled, selected, setSelected }) {
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

    const [showTable, setShowTable] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const handleSelected = row => {
        if (selected.submissionId !== row.submissionId) {
            setSelected(row);
        }
        setShowTable(false);
    };

    const exportToExcel = () => {
        let xlsx = require('json-as-xlsx');
        var columns = [
            { label: 'Username', value: 'userName' },
            { label: 'Email', value: 'email' },
        ]
        var i;
        for (i = 0; i < roomDetails.specialFields.length; i ++){
            columns.push(
                { label: roomDetails.specialFields[i], value: 'special_' + i }
            )
        }
        if(questionDetails.noOfTCases > 0){
            columns.push(
                { label: "Cases Passed (" + questionDetails.noOfTCases + ")", value: row => (row.submissionId !== 0 ? row.tCasesPassed : "") }
            )
        }
        columns.push(
            { label: "Submitted At", value: row => (row.submissionId !== 0 ? moment(row.submittedAt).format("MMMM Do, h:mm a") : "") }
        )
        

        var content = [], toPush;
        for (var student of enrolled){
            toPush = {
                submissionId: student.submissionId,
                userName: student.userName,
                email: student.email,
                tCasesPassed: student.tCasesPassed,
                submittedAt: student.submittedAt,
            }
            for(i = 0; i < roomDetails.specialFields.length; i ++){
                toPush['special_' + i] = student.specialFields[i];
            }
            content.push(toPush);
        }

        let data = [
            {
                sheet: 'Sheet 1',
                columns: columns,
                content: content
            }
        ]

        let settings = {
            fileName: questionDetails.title + " Submissions", // Name of the spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
        }

        xlsx(data, settings) // Will download the excel file
    }

    const columns = [
        {
            title: "Username",
            dataIndex: "userName",
            key: "userName",
            ...getColumnSearchProps("userName"),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "SpecialFields",
            children: roomDetails.specialFields.map((field, index) => {
                return {
                    title: field,
                    // dataIndex: field,
                    key: field,
                    render: row => row.specialFields[index],
                    sorter: (a, b) => a.specialFields[index] - b.specialFields[index],
                    sortDirections: ["descend", "ascend"],
                };
            }),
            hidden: roomDetails.specialFields.length === 0,
        },
        {
            title: "Cases Passed (" + questionDetails.noOfTCases + ")",
            key: "cases",
            // width: "100px",
            render: row => (row.submissionId !== 0 ? <> {row.tCasesPassed} </> : <></>),
            hidden: questionDetails.noOfTCases === 0,
        },
        {
            title: "Submitted At",
            key: "submittedAt",
            // width: "100px",
            render: row => (row.submissionId !== 0 ? <> {moment(row.submittedAt).format("MMMM Do, h:mm a")} </> : <></>),
            // sorter: (a, b) => moment(a.submittedAt) - moment(b.submittedAt),
            sorter: (a, b) => {
                if(!b.submittedAt){
                    return -1;
                }
                if(!a.submittedAt){
                    return 1;
                }
                else{
                    return moment(a.submittedAt) - moment(b.submittedAt);
                }
            },
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "Submitted",
            key: "submitted",
            width: "100px",
            render: row =>
                row.submissionId !== 0 ? (
                    <Button
                        onClick={() => {
                            handleSelected(row);
                        }}
                    >
                        View Submission
                    </Button>
                ) : (
                    <>Not submitted</>
                ),
        },
    ].filter(item => !item.hidden);

    return (
        <div>
            <div style={{ textAlign: "left", paddingLeft: "15px", paddingBottom: "15px", borderBottom: "2px solid #fff" }}>
                <Button
                    onClick={() => {setShowTable(true);}}
                    style={{ margin: "20px 0px 0px 0px" }}
                    type="primary"
                >
                    Open Submission Table
                </Button>
                <Button
                    icon={<SiMicrosoftexcel style={{marginRight: '10px'}} />}
                    onClick={exportToExcel}
                    style={{ margin: "20px 0px 0px 20px" }}
                >
                    Export to excel
                </Button>
            </div>
            <div style={{ padding: "15px", borderBottom: "2px solid #fff" }}>
                <div className="myRooms-cards-description">
                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>Username</span>
                    {selected.userName}
                </div>
                <div className="myRooms-cards-description">
                    <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>Name</span>
                    {selected.name}
                </div>
                {selected.submissionId !== 0 ? (
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>Submitted At</span>
                        {moment(selected.submittedAt).format("MMMM Do, h:mm a")}
                    </div>
                ) : (<></>)}
                {roomDetails.specialFields.map((field, index) => (
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>{field}</span>
                        {selected.specialFields[index]}
                    </div>
                ))}
                {questionDetails.noOfTCases !== 0 ? (
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>
                            Cases passed
                        </span>
                        {/* <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "120px" }}> */}

                        {selected.tCasesPassed}/{questionDetails.noOfTCases}
                        {/* </span> */}
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <Modal
                title={<div style={{ width: "1000px" }}>Submissions</div>}
                centered
                visible={showTable}
                footer={null}
                // bodyStyle={{width: "80vw"}}
                closable={true}
                onCancel={() => {
                    setShowTable(false);
                }}
                width="80vw"
            >
                {/* <div style={{width: '1000px'}}>hii</div> */}
                <Table columns={columns} dataSource={enrolled} size="small" pagination={false} />
            </Modal>
        </div>
    );
}
