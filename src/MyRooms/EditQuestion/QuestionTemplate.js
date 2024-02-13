import { Button } from "antd";
import axios from "axios";
import { convertToRaw } from "draft-js";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { logoutUser } from "../../Redux/Actions/AuthActions";
import DescriptionEditor from "../../TextEditor/MyTextEditor";

export default function QuestionTemplate({ title, setTitle, description, setDescription, sample, setSample, _type }) {
    const [loading, setLoading] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleTitleChange = e => {
        if(e.target.value.length > 30) {
            enqueueSnackbar("Title cannot be more than 30 characters", { variant: "info" });
            return;
        }
        setTitle(e.target.value);
    };
    const handleDescChange = e => {
       setDescription(e);
    };

    const handleSampleChange = e => {
        const newSample = {...sample};
        newSample[e.target.name] = e.target.value;
        setSample(newSample);
    };
    
    const saveQuestionTemplate = async() => {
        setLoading(true);
        await axios.post("/save_question_template", {
            questionId: queryParams.get("qId"),
            title: title,
            template: {
                description: convertToRaw(description.getCurrentContent()),
                sample: sample
            },
        })
            .then(res => {
                enqueueSnackbar("Saved successfully !", {variant: "success"})
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
                    enqueueSnackbar("Some error occured while saving !!", { variant: "error" });
                    // history.replace("/my_rooms");
                }
        });
        setLoading(false);
    }
    
    
    return (
        <>
            <span style={{width: '95%', display: 'inline-flex', justifyContent: 'space-between'}}>
                <span style={{fontSize: '20px'}}>Type : {_type}</span>
                <Button type="primary" onClick={saveQuestionTemplate} loading={loading}>
                    Save
                </Button>
            </span>
            <div className="outer-scroll-div">
                <input value={title} onChange={handleTitleChange} className="question-title" />
                
                <h2 style={{ textAlign: "left", marginLeft: "10px" }}>
                    Description
                </h2>
                <span style={{ padding: "10px" }}>
                    <DescriptionEditor state={description} setState={handleDescChange} readOnly={false} />
                </span>

                {
                    _type === "code" ? (
                        <div className="question-sample-case-outer">
                            <h2>Sample Case</h2>
                            
                            <h3 className="question-sample-case-title">Sample Input</h3>
                            <textarea
                                className="question-sample-case-input"
                                value={sample.input}
                                name="input"
                                onChange={handleSampleChange}
                            />
                            <h3 className="question-sample-case-title">Sample Output</h3>
                            <textarea
                                className="question-sample-case-input"
                                value={sample.output}
                                name="output"
                                onChange={handleSampleChange}
                            />
                            <h3 className="question-sample-case-title">Explanation</h3>
                            <textarea
                                className="question-sample-case-input"
                                value={sample.explanation}
                                name="explanation"
                                onChange={handleSampleChange}
                            />
                        </div>
                    ) : (<></>)
                }
            </div>
        </>
    );
}
