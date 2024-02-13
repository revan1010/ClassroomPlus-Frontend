import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Select } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { useSnackbar } from "notistack";
import moment from "moment";

export default function SelectStudent({ questions, questionDetails, roomDetails, enrolled, selectedQuestionIndex, setSelectedQuestionIndex, selected, setSelected }) {
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
        setSelected(row);
        setShowTable(false);
    };

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
            title: "Submitted",
            key: "submitted",
            width: "100px",
            render: row =>
                    <Button
                        onClick={() => {
                            handleSelected(row);
                        }}
                    >
                        View Submission
                    </Button>
        },
    ].filter(item => !item.hidden);

    const handleNextStudent = () => {
        if (selectedQuestionIndex < questions.length - 1) {
            setSelectedQuestionIndex(selectedQuestionIndex + 1);
            return;
        }

        setSelectedQuestionIndex(0);
        var nextStudentIndex = (enrolled.findIndex(student => student.userName === selected.userName) + 1) % enrolled.length;
        handleSelected(enrolled[nextStudentIndex]);


    };


    return (
        <div>
            <div style={{ textAlign: "left", paddingLeft: "15px", paddingBottom: "15px", borderBottom: "2px solid #fff", display: 'flex'}}>
                <Button
                    onClick={() => {setShowTable(true);}}
                    style={{ margin: "20px 0px 0px 0px" }}
                    type="primary"
                >
                    Open Submission Table
                </Button>
                <Button
                    onClick={() => {handleNextStudent(true);}}
                    style={{ margin: "20px 0px 0px 10px" }}
                    // type="primary"
                >
                    Next
                </Button>
                <div style={{display: 'inline-flex'}}>

                <Select
                    onChange={value => {
                        setSelectedQuestionIndex(value);
                    }}
                    // style={{ width: "100%" }}
                    style={{ margin: "20px 0px 0px 15px", width: "130px" }}

                    value={selectedQuestionIndex}
                >
                    {questions.map((question, index) => {
                        return (
                            <Select.Option key={index} value={index}>
                                {question.title}
                            </Select.Option>
                        );
                    })}
                </Select>
                </div>
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
                {selected.submissions[selectedQuestionIndex].submissionId !== 0 ? (
                    <>
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>Submitted At</span>
                        {moment(selected.submissions[selectedQuestionIndex].submittedAt).format("MMMM Do, h:mm a")}
                    </div>
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>Due Date</span>
                        {moment(questionDetails.endTime).format("MMMM Do, h:mm a")}
                    </div>
                    </>
                ) : (<></>)}
                {roomDetails.specialFields.map((field, index) => (
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>{field}</span>
                        {selected.specialFields[index]}
                    </div>
                ))}
                {questions[selectedQuestionIndex].testCases ? (
                    <div className="myRooms-cards-description">
                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "170px" }}>
                            Cases passed
                        </span>
                        {/* <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "120px" }}> */}

                        {selected.submissions[selectedQuestionIndex].tCasesPassed}/{questions[selectedQuestionIndex].testCases}
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