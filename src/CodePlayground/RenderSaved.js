import { MdDeleteForever } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import React from "react";
import { Button, Tooltip } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

export default function RenderSaved({ savedCodes, setSavedCodes, setSelectedCode, setLoading, setOutput, setInput }) {
    const loadSavedCode = (index) => {
        setLoading(true);
        setInput("");
        setOutput("");
        setSelectedCode(savedCodes[index]);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }
    const handleDelete = (index) => {
        setLoading(true);
        setSavedCodes( [...savedCodes.filter((code, i) => i !== index)] );
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }
    const handleNew = () => {
        setLoading(true);
        setInput("");
        setOutput("");

        setSelectedCode({
            id: Math.floor(Math.random() * 100000),
            name: "",
            code: "// code goes here",
            language: "cpp"
        });

        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    return savedCodes.length === 0 ? (
        <>
            <div className="playground-code-title">
                No Codes Saved !
            </div>
            <Button type="primary" style={{margin: '20px 0px', fontSize: '20px', height: '100%'}} icon={<PlusCircleFilled />} onClick={handleNew}>
                New
            </Button>
        </>
    ) : (
        <>
            <div className="playground-code-title" >
                Saved Codes ...
            </div>
            <Button type="primary" style={{margin: '20px 0px', fontSize: '20px', height: '100%'}} icon={<PlusCircleFilled />} onClick={handleNew}>
                New
            </Button>
            <div className="outer-scroll-div" style={{height: '600px'}}>
                {savedCodes.map((code, index) => (
                    <div className="playground-saved-codes">
                        <div className="playground-saved-codes-inner">
                            <span style={{alignItems: 'center', marginRight: '8px'}}>{code.name}</span>
                            <span style={{display: 'inline-flex', alignItems: 'center'}}>
                                <span style={{display: 'inline-flex', alignItems: 'center'}} onClick={() => {loadSavedCode(index)}} >
                                    <Tooltip title="Load saved code to editor">
                                        <BsFillArrowUpRightCircleFill style={{fontSize: '25px', marginRight: '8px'}} />
                                    </Tooltip>
                                </span>
                                <span style={{display: 'inline-flex', alignItems: 'center'}} onClick={() => {handleDelete(index)}}>
                                    <Tooltip title="Delete saved code">
                                        <MdDeleteForever style={{fontSize: '25px'}} />
                                    </Tooltip>
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
