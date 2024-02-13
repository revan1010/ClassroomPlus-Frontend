import { Button, DatePicker, Switch, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { logoutUser } from "../../Redux/Actions/AuthActions";

export default function QuestionSettings({ questionSettings, setQuestionSettings }) {
    // console.log("dddd", questionSettings);
    const [date, setDate] = useState(moment(questionSettings.endTime));
    const [loading, setLoading] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDateChange = e => {
        // console.log(moment(e).format());
        setDate(e);
    };

    const changeVisiblity = (e) => {
        setQuestionSettings({
            ...questionSettings,
            isVisible: !questionSettings.isVisible
        })
        // console.log(e);
    }

    const saveSettings = async() => {
        setLoading(true);
        await axios.post("/save_question_settings", {
            questionId: queryParams.get("qId"),
            endTime: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            isVisible: questionSettings.isVisible
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
                }
        });
        setLoading(false);
    }

    return (
        <div>
            <div style={{width: '100%', fontSize: '20px', textAlign: 'left', marginLeft: '20px'}}>
                <span style={{display: 'inline-flex', marginRight: '20px', minWidth: '150px'}}>
                    End Time 
                </span>
                <DatePicker
                    disabledDate={current => {
                        return current && current < moment(moment().format());
                    }}
                    allowClear={false}
                    value={date}
                    onChange={handleDateChange}
                />
                <TimePicker 
                    allowClear={false}
                    value={date} 
                    onChange={handleDateChange}
                />
            </div>           
            <div style={{width: '100%', fontSize: '20px', textAlign: 'left', marginLeft: '20px'}}>
                <span style={{display: 'inline-flex', marginRight: '20px', minWidth: '150px'}}>
                    Is Visible 
                </span>
                <Switch onChange={changeVisiblity} checked={questionSettings.isVisible} />
            </div>
            <div style={{width: '100%', fontSize: '20px', marginTop: '20px'}}>
                <Button type="primary" onClick={saveSettings} loading={loading}>
                    Save
                </Button>
            </div>
        </div>
    );
}
