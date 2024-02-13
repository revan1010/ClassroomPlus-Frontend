import { Modal } from 'antd';
import axios from 'axios';
import { convertFromRaw, EditorState } from 'draft-js';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import SemipolarLoading from 'react-loadingg/lib/SemipolarLoading';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import SplitPane, { Pane } from 'react-split-pane';
import { logoutUser } from '../../Redux/Actions/AuthActions';
import { setBreadcrumb } from '../../Redux/Actions/RoomsDataActions';
import QuestionPreview from '../EditQuestion/QuestionPreview';
import SelectStudent from './SelectStudent';
import CodeType from './CodeType';
import FileType from './FileType';

export default function AllQuestionsSubmissions() {
    document.title = "All Submissions | Code Rooms";

    const [loading, setLoading] = useState(true);
    const [overlayLoading, setOverlayLoading] = useState(false);

    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const [roomInfo, setRoomInfo] = useState({});

    // const [questionDetails, setQuestionDetails] = useState({});
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [enrolled, setEnrolled] = useState({});

    const [selected, setSelected] = useState({});

    useEffect(async() => {
        dispatch(setBreadcrumb( [
            {
                "name": "My Rooms",
                "url": "/my_rooms"
            },
            {
                "name": roomInfo.roomName,
                "url": "/my_rooms/" + roomInfo.roomId
            },
            {
                "name": "All Submissions",
                "url": "/all_submissions?roomId=" + queryParams.get("roomId")
            },
        ] ));
    }, [roomInfo.roomId]);


    useEffect(async() => {
        setLoading(true);
        await axios.get(`/all_submissions/${queryParams.get("roomId")}`)
            .then(res => {
                setRoomInfo(res.data.roomInfo);
                setQuestions(res.data.questions);

                if(res.data.questions.length === 0) {
                    enqueueSnackbar("No questions in room.", { variant: "info" });
                    history.replace("/my_rooms/" + res.data.roomDetails.roomId)
                }

                // setQuestionDetails(res.data.questions[0]);
                setSelectedQuestionIndex(0);
                setEnrolled(res.data.enrolled);
                if(res.data.enrolled.length === 0) {
                    enqueueSnackbar("No students enrolled.", { variant: "info" });
                    history.replace("/my_rooms/" + res.data.roomDetails.roomId)
                }
                setSelected(res.data.enrolled[0]);
            })
            .catch(err => {
                try {
                    if (err.response.status === 401) {
                        dispatch(logoutUser());
                        return;
                    }
                    enqueueSnackbar(err.response.data.detail, { variant: "error" });
                    history.replace("/my_rooms");
                } catch (error) {
                    enqueueSnackbar("Some error occured while getting submissions", { variant: "error" });
                    history.replace("/my_rooms");
                }
            })

        setLoading(false);

    }, []);

    const renderRightPane = () => {
        if(selected.submissions[selectedQuestionIndex].submissionId === 0) {
            return <div className="playground-code-title" style={{color: 'var(--privateRoom)'}}>
                        No Submission Found
                    </div>
        }

        if(questions[selectedQuestionIndex]["_type"] === "code"){
            return (
                <CodeType
                    selectedQuestionIndex={selectedQuestionIndex}
                    setOverlayLoading={setOverlayLoading}
                    selected={selected}
                    setSelected={setSelected}
                />
            )
        } 
        else{
            return(
                <FileType 
                    questionId={questions[selectedQuestionIndex].questionId}
                    submissionId={selected.submissions[selectedQuestionIndex].submissionId}
                />
            )
        }
    }


    return loading ? (
        <div className="VerifyEmail-heading-div">
            <div>Loading Submissions ....</div>
            <div style={{ marginTop: "40px", position: "relative" }}>
                <SemipolarLoading size="large" color="var(--loadingColor)" />
            </div>
        </div>
    ) : (
        <div>
            <Modal centered visible={overlayLoading} footer={null} bodyStyle={{ padding: "0px" }} closable={false}>
                <SemipolarLoading size="large" color="var(--loadingColor)" />
            </Modal>
            <SplitPane style={{ position: "absolute" }} minSize={350} maxSize={620} defaultSize={400} split="vertical">
                    <Pane>
                        <SelectStudent
                            questions={questions}
                            questionDetails={questions[selectedQuestionIndex]}
                            roomDetails={roomInfo}
                            enrolled={enrolled}
                            selectedQuestionIndex={selectedQuestionIndex}
                            setSelectedQuestionIndex={setSelectedQuestionIndex}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <QuestionPreview
                            title={questions[selectedQuestionIndex].title} 
                            description={EditorState.createWithContent(convertFromRaw(questions[selectedQuestionIndex].template.description))} 
                            sample={questions[selectedQuestionIndex].template.sample}     
                        />
                    </Pane>
                    {renderRightPane()}
            </SplitPane>
            
        </div>
    )
}
