import { Modal } from 'antd';
import axios from 'axios';
import { convertFromRaw, EditorState } from 'draft-js';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import SemipolarLoading from 'react-loadingg/lib/SemipolarLoading';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import SplitPane, { Pane } from 'react-split-pane';
import QuestionPreview from '../EditQuestion/QuestionPreview';
import { logoutUser } from '../../Redux/Actions/AuthActions';
import { setBreadcrumb } from '../../Redux/Actions/RoomsDataActions';
import CodeType from './CodeType';
import ManageSelected from './ManageSelected';
import FileType from './FileType';

export default function CheckSubmissions() {
    document.title = "Submissions | Code Rooms";

    const [loading, setLoading] = useState(true);
    const [overlayLoading, setOverlayLoading] = useState(false);
    const [questionDetails, setQuestionDetails] = useState({});
    const [roomDetails, setRoomDetails] = useState({});
    const [enrolled, setEnrolled] = useState([])
    const [selected, setSelected] = useState({})

    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(async() => {
        dispatch(setBreadcrumb( [
            {
                "name": "My Rooms",
                "url": "/my_rooms"
            },
            {
                "name": roomDetails.roomName,
                "url": "/my_rooms/" + roomDetails.roomId
            },
            {
                "name": "Submissions ("+questionDetails.title+")",
                "url": "/submissions?qId=" + queryParams.get("qId")
            },
        ] ));
    }, [roomDetails.roomId]);

    useEffect(async () => {
        setLoading(true);
        if (!queryParams.has("qId")) {
            enqueueSnackbar("Invalid question.", { variant: "warning" });
            history.replace("/my_rooms");
        }
        await axios
            .get("/question_submissions", {
                params: {
                    questionId: queryParams.get("qId"),
                },
            })
            .then(res => {
                setQuestionDetails({
                    title: res.data.questionDetails.title,
                    description: EditorState.createWithContent(convertFromRaw(res.data.questionDetails.template.description)),
                    sample: res.data.questionDetails.template.sample,
                    endTime: res.data.questionDetails.endTime,
                    noOfTCases: res.data.questionDetails.testCases,
                    _type: res.data.questionDetails._type
                });

                setRoomDetails({
                    roomId: res.data.roomDetails.roomId,
                    roomName: res.data.roomDetails.roomName,
                    specialFields: res.data.roomDetails.specialFields,
                });

                setEnrolled(res.data.enrolled);

                var select = {};
                for(var i = 0; i < res.data.enrolled.length; i ++){
                    if(res.data.enrolled[i].submissionId !== 0){
                        select = res.data.enrolled[i];
                        break;
                    }
                }
                if(i === res.data.enrolled.length){
                    enqueueSnackbar("No submissions recorded", { variant: "info" });
                    history.replace("/my_rooms/" + res.data.roomDetails.roomId)
                }
                setSelected(select);

            })
            .catch(err => {
                // console.log(err);
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
            });
            setTimeout(() => {
                
                setLoading(false);
            }, 500);
    }, []);

    const renderRightPane = () => {
        if(questionDetails._type === "code"){
            return (
                <CodeType 
                    setOverlayLoading={setOverlayLoading}
                    selected={selected}
                    setSelected={setSelected}
                />
            )
        } 
        else{
            return(
                <FileType 
                    selected={selected}
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
                        <ManageSelected
                            questionDetails={questionDetails}
                            roomDetails={roomDetails}
                            enrolled={enrolled}
                            setEnrolled={setEnrolled}
                            selected={selected}
                            setSelected={setSelected}
                        />
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
