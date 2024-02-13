import React from "react";
import { Popconfirm, Result, Tooltip } from "antd";
import { PieChart } from "react-minimal-pie-chart";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import moment from "moment";
import { RiDeleteBin5Line, RiCodeLine, RiFileAddLine } from "react-icons/ri";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Actions/AuthActions";

export default function RenderQuestions({getInitialData, questions, enrolled }) {
    const breakpoints = {
        default: 5,
        1900: 4,
        1520: 3,
        1180: 2,
        830: 1,
    };

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const deleteQuestion = async (id) => {
        await axios.post("/delete_question", {
            questionId: id,
        })
            .then(res => {
                enqueueSnackbar("Question deleted succesfully!", { variant: "info" });
                getInitialData();
            })
            .catch(err => {
                try {
                    if (err.response.status === 401) {
                        dispatch(logoutUser());
                        return;
                    }
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                } catch (error) {
                    enqueueSnackbar("Some error occured while deleting this room", { variant: "error" });
                }
            });
     };


    const renderVisibility = (question) => {

        if(!question.isVisible){
            return(
                <div className={"myRooms-room-visibility myRooms-hidden-room" } >
                    Hidden
                </div>
            )
        }
        if( moment(moment().format()).isAfter(moment(question.endTime)) ){
            return(
                <div className={"myRooms-room-visibility myRooms-private-room" } >
                    Due Over
                </div>
            )
        }
        if(question.isVisible){
            return(
                <div className={"myRooms-room-visibility myRooms-public-room" } >
                    Visible
                </div>
            )
        }
        else{
            return(
                <div className={"myRooms-room-visibility myRooms-hidden-room" } >
                    Hidden
                </div>
            )
        }

    }

    return questions.length === 0 ? (
        <Result title="No Questions in this room."/>
    ) : (
        <>
            <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {questions.map(question => (
                    <>
                        <div className="myRooms-cards-box" style={{cursor: 'auto'}}>
                            <Popconfirm
                                title={
                                    <>
                                        Are you sure you want to delete this Question?
                                        <br />
                                        Deleting this question will remove all its data and will be lost forever.
                                    </>
                                }
                                onConfirm={() => {deleteQuestion(question.questionId);}}
                                okText="Yes"
                                cancelText="Cancel"
                                overlayInnerStyle={{
                                    maxWidth: "400px",
                                    backgroundColor: "var(--primaryBackground)",
                                    border: "2px solid var(--primaryText)",
                                }}
                            >
                                <div style={{ position: "absolute", top: "2%", right: "2%", fontSize: "25px", cursor: 'pointer' }}>
                                    <RiDeleteBin5Line />
                                </div>
                            </Popconfirm>   

                            <Tooltip title={"Type : " + question.type} >
                                <div style={{ position: "absolute", top: "2%", left: "2%", fontSize: "25px", cursor: 'pointer' }}>
                                    {question.type === "code" ? <RiCodeLine /> : <RiFileAddLine />}
                                </div>
                            </Tooltip>

                            <div className="myRooms-cards-info">
                                <div className="myRooms-cards-title" style={{paddingLeft: '30px', paddingRight: "30px"}}>
                                    <span>{question.title}</span>
                                </div>
                            </div>
                            <div style={{display: "inline-flex", justifyContent: "space-between", width: "100%", padding: "0px 15px"}} >
                                <div>
                                    <div className="myRooms-cards-description">
                                        <div className="questions-submitted-div" />
                                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "120px" }}>
                                            Submitted
                                        </span>
                                        {question.submitted}
                                    </div>
                                    <div className="myRooms-cards-description">
                                        <div className="questions-remaining-div" />
                                        <span style={{ marginLeft: "10px", display: "inline-flex", minWidth: "120px" }}>Remaining</span>
                                        {enrolled - question.submitted}
                                    </div>
                                </div>
                                <PieChart
                                    style={{ width: "70px" }}
                                    lineWidth={35}
                                    paddingAngle={5}
                                    data={[
                                        { 
                                            title: "Submitted (" + question.submitted + ")",
                                            value: question.submitted, 
                                            color: "var(--success)" 
                                        },
                                        { 
                                            title: "Not Submitted (" + (enrolled - question.submitted) + ")", 
                                            value: enrolled === 0 ? 1 : (enrolled - question.submitted), 
                                            color: "var(--error)"
                                        },
                                    ]}
                                />
                            </div>
                            <div className="myRooms-card-bottom-bar" style={{margin: '15px 0px'}}>
                                {renderVisibility(question)}
                            </div>
                            <div>
                                <Link className="myRooms-cards-buttons" to={"/edit_question?qId=" + question.questionId}>
                                    Edit
                                </Link>
                                <Link className="myRooms-cards-buttons" to={"/submissions?qId=" + question.questionId}>
                                    Submissions
                                </Link>
                            </div>
                        </div>
                    </>
                ))}
            </Masonry>
        </>
    );
}
