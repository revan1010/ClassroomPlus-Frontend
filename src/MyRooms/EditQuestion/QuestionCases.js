import { Button } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { logoutUser } from "../../Redux/Actions/AuthActions";


export default function QuestionCases({testCases, setTestCases}) {
    const [loading, setLoading] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();
    

    const removeCase = (i) => {
        setTestCases( testCases.filter((tcase, index) => index !== i ) );
    }

    const addCase = () => {
        if(testCases.length >= 5){
            enqueueSnackbar("Can add upto only 5 cases !", {variant: "info"});
            return;
        }
        setTestCases( [...testCases, {
            input: "",
            output: ""
        }] )
    }

    const handleChange = (e, index, name) => {
        const newCases = [...testCases];
        newCases[index][name] = e.target.value;

        setTestCases(newCases);
    }

    const saveCases = async() => {
        setLoading(true);
        await axios.post("/save_question_tcases", {
            questionId: queryParams.get("qId"),
            testCases: testCases,
        })
        .then(res => {
            // console.log(res);
            enqueueSnackbar("Saved successfully !", {variant: "success"})
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
                enqueueSnackbar("Some error occured while saving !!", { variant: "error" });
                // history.replace("/my_rooms");
            }
        });
        setLoading(false);
    }

    

    return (
        <>
            <span style={{width: '95%', display: 'inline-flex', justifyContent: 'space-between', marginBottom: '30px'}}>
                <span></span>
                <span>
                    <Button onClick={addCase} disabled={loading}>
                        Add
                    </Button>
                    <Button style={{marginLeft: '10px'}} type="primary" onClick={saveCases} loading={loading}>
                        Save
                    </Button>
                </span>
            </span>
            <div className="outer-scroll-div" style={{paddingBottom: '250px'}}>
                {
                    testCases.map((tcase, index) => (
                        <>
                            <span style={{width: '95%', display: 'inline-flex', justifyContent: 'space-between', margin: '20px 0px 0px 0px'}}>
                                <span>Case #{index + 1}</span>
                                <span>
                                    <Button onClick={() => {removeCase(index)}} danger={true} disabled={loading}>
                                        Remove
                                    </Button>
                                </span>
                            </span>

                            <div style={{width: '100%', display: 'inline-flex'}}>
                                <textarea 
                                    placeholder="Case Input"
                                    className="question-sample-case-input"
                                    style={{width: '100%', margin: '5px'}}
                                    value={tcase.input}
                                    onChange={(e) => {handleChange(e, index, "input")}}
                                />
                                <textarea 
                                    placeholder="Expected Output"
                                    className="question-sample-case-input"
                                    style={{width: '100%', margin: '5px'}}
                                    value={tcase.output}
                                    onChange={(e) => {handleChange(e, index, "output")}}
                                />
                            </div>
                        </>
                    ))
                }
                
            </div>
        </>
    )
}
