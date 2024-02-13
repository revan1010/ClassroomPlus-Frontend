import { Modal } from 'antd';
import Countdown from 'antd/lib/statistic/Countdown';
import axios from 'axios';
import { convertFromRaw, EditorState } from 'draft-js';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import SemipolarLoading from 'react-loadingg/lib/SemipolarLoading';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import SplitPane, { Pane } from 'react-split-pane';
import QuestionPreview from '../../MyRooms/EditQuestion/QuestionPreview';
import { logoutUser } from '../../Redux/Actions/AuthActions';
import { setBreadcrumb } from '../../Redux/Actions/RoomsDataActions';
import CodeType from './CodeType';
import FileType from './FileType';

export default function ViewQuestion() {
    document.title = "Question | Code Rooms";

    const [loading, setLoading] = useState(true);
    const [overlayLoading, setOverlayLoading] = useState(false);
    const [questionDetails, setQuestionDetails] = useState({});
    const [roomDetails, setRoomDetails] = useState({});

    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(async () => {
        setLoading(true);
        if (!queryParams.has("qId")) {
            enqueueSnackbar("Invalid question.", { variant: "warning" });
            history.replace("/enrolled_rooms");
        }
        await axios
            .get("/question_for_member", {
                params: {
                    questionId: queryParams.get("qId"),
                },
            })
            .then(res => {
                setQuestionDetails({
                    _type: res.data.details._type,
                    title: res.data.details.title,
                    description: EditorState.createWithContent(convertFromRaw(res.data.details.template.description)),
                    sample: res.data.details.template.sample,
                    endTime: res.data.details.endTime,
                    savedCode: res.data.details.savedCode,
                    language: res.data.details.language || "cpp",
                    submitted: res.data.details.submitted,
                    submittedAt: res.data.details.submittedAt,
                    submissionId: res.data.details.submissionId,
                });

                setRoomDetails({
                    roomId: res.data.details.roomId,
                    roomName: res.data.details.roomName
                })

            })
            .catch(err => {
                try {
                    if (err.response.status === 401) {
                        dispatch(logoutUser());
                        return;
                    }
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                    history.replace("/enrolled_rooms");
                } catch (error) {
                    enqueueSnackbar("Some error occured while getting question details.", { variant: "error" });
                    history.replace("/enrolled_rooms");
                }
            });
        setLoading(false);
    }, []);

    useEffect(async() => {
        dispatch(setBreadcrumb( [
            {
                "name": "Enrolled Rooms",
                "url": "/enrolled_rooms"
            },
            {
                "name": roomDetails.roomName,
                "url": "/enrolled_rooms/" + roomDetails.roomId
            },
            {
                "name": questionDetails.title,
                "url": "/question?qId=/" + queryParams.get("qId")
            },
        ] ));
    }, [roomDetails.roomId]);


    const renderRightPane = () => {
        if(questionDetails._type === "code"){
            return (
                <CodeType 
                    overlayLoading={overlayLoading}
                    setOverlayLoading={setOverlayLoading}
                    questionDetails={questionDetails}
                    setQuestionDetails={setQuestionDetails}
                />
            )
        }
        else{
            return(
                <FileType 
                    setOverlayLoading={setOverlayLoading} 
                    questionDetails={questionDetails}
                    setQuestionDetails={setQuestionDetails}
                />
            )
        }
    }


    return loading ? (
        <div className="VerifyEmail-heading-div">
            <div>Loading Question ....</div>
            <div style={{ marginTop: "40px", position: "relative" }}>
                <SemipolarLoading size="large" color="var(--loadingColor)" />
            </div>
        </div>
    ) : (
        <div>
            <Modal centered visible={overlayLoading} footer={null} bodyStyle={{ padding: "0px" }} closable={false}>
                <SemipolarLoading size="large" color="var(--loadingColor)" />
            </Modal>

            <SplitPane style={{ position: "absolute" }} minSize={300} maxSize={620} defaultSize={400} split="vertical">
                <Pane>
                    <div style={{ padding: "15px", borderBottom: "2px solid #fff" }}>
                        <div className="myRooms-cards-description" style={{fontSize: '15px', 
                            color: moment(questionDetails.endTime).diff(moment().format(), 'seconds') < 0 ? 'red' : '#fff'
                        }}>
                            <span style={{display: "inline-flex", minWidth: "170px" }}>End Time</span>
                            {
                                moment(questionDetails.endTime).diff(moment().format(), 'hours') > 10 || moment(questionDetails.endTime).diff(moment().format(), 'seconds') < 0 ?
                                moment(questionDetails.endTime).format("Do MMM hh:mm a")
                                :     
                                <Countdown
                                    valueStyle={{fontSize: '15px', color: 'var(--privateRoom)'}}
                                    value={questionDetails.endTime}
                                    onFinish={() => {
                                        window.location.reload();
                                    }}
                                    format="H[h] : m[m] : s[s]"
                                />
                            }
                        </div>
                        {
                            questionDetails.submitted ? (
                                <div className="myRooms-cards-description" style={{fontSize: '15px'}}>
                                    <span style={{ display: "inline-flex", minWidth: "170px" }}>Submitted At</span>
                                    {moment(questionDetails.submittedAt).format("Do MMM hh:mm a")}
                                </div>
                            ) : (<></>)
                        }
                    </div>
                    <QuestionPreview 
                        title={questionDetails.title} 
                        description={questionDetails.description} 
                        sample={questionDetails.sample}     
                    />
                </Pane>
                {renderRightPane()}
            </SplitPane>
        </div>
    )
}
