import { Button, Result, Statistic } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { IoMdDoneAll } from "react-icons/io";
import { BsPatchExclamation } from "react-icons/bs";
import moment from "moment";
import { RiCodeLine, RiFileAddLine } from "react-icons/ri";


const { Countdown } = Statistic;

export default function RenderQuestions({ questions }) {
    const breakpoints = {
        default: 5,
        1900: 4,
        1520: 3,
        1180: 2,
        830: 1,
    };

    const timeConditions = (question) => {
        if(question.isSubmitted){
            return(
                <div style={{fontSize: '18px', color: "var(--success)"}}>
                    At {moment(question.submissionTime).format("Do MMM hh:mm a")}
                </div>
            )
        }
        if(moment(question.endTime).diff(moment().format(), 'seconds') < 0 ){
            return(
                <div style={{color: 'var(--privateRoom)', fontSize: '22px'}}>
                    Due date over
                </div>
            )
        }
        if(moment(question.endTime).diff(moment().format(), 'hours') > 48){
            return(
                <span style={{ fontSize: "20px", display: "inline-flex", color: "var(--privateRoom)" }}>
                    Due : {moment(question.endTime).format("Do MMM")}
                </span>
            )
        }
        if(moment(question.endTime).diff(moment().format(), 'hours') > 24){
            return(
                <span style={{ fontSize: "20px", display: "inline-flex", color: "var(--privateRoom)" }}>
                    Due : Tommorow
                </span>
            )
        }
        if(moment(question.endTime).diff(moment().format(), 'hours') > 10){
            return(
                <span style={{ fontSize: "20px", display: "inline-flex", color: "var(--privateRoom)" }}>
                    Due : Today
                </span>
            )
        }
        else{
            return(
                <div>
    
                    <Countdown
                        valueStyle={{color: 'var(--privateRoom)', fontSize: '22px'}}
                        value={question.endTime}
                        onFinish={() => {
                            window.location.reload();
                        }}
                        format="[Due] : H[h] : m[m] : s[s]"
                    />
                </div> 
            )
        }
    }

    return questions.length === 0 ? (
        <Result
            title="No Questions in this room."
            extra={
                <Button type="primary" key="console">
                    No Questions in this room.
                </Button>
            }
        />
    ) : (
        <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
            {questions.map(question => (
                <Link to={"/question?qId=" + question.questionId } key={"room.roomId"}>
                    <div className="myRooms-cards-box">
                        <div className="myRooms-cards-info">
                            <div className="myRooms-cards-title">
                                <span>{question.title}</span>
                            </div>
                            <div className="myRooms-cards-description">
                                {
                                    question._type === "code" ? (
                                        <>
                                            <RiCodeLine />
                                            <span style={{ marginLeft: "10px", display: "inline-flex" }}>
                                                Code Type
                                            </span>
                                        </>
                                    ) :(
                                        <>
                                            <RiFileAddLine />
                                            <span style={{ marginLeft: "10px", display: "inline-flex" }}>
                                                File Type
                                            </span>
                                        </>
                                    )
                                }
                            </div>
                            {
                                question.isSubmitted ? (
                                    <div className="myRooms-cards-description">
                                        <IoMdDoneAll style={{color: "var(--success)"}} />
                                        <span style={{ marginLeft: "10px", display: "inline-flex", color: "var(--success)" }}>
                                            Submitted
                                        </span>
                                    </div>

                                ) : (
                                    <div className="myRooms-cards-description">
                                        <BsPatchExclamation style={{color: "var(--privateRoom)"}} />
                                        <span style={{ marginLeft: "10px", display: "inline-flex", color: "var(--privateRoom)" }}>
                                            Not Submitted
                                        </span>
                                    </div>
                                )
                            }
                            <div className="myRooms-card-bottom-bar">
                                {timeConditions(question)}
                            </div>
                            
                        </div>
                    </div>
                </Link>
            ))}
        </Masonry>
    );
}


// () => {
//     
//     }