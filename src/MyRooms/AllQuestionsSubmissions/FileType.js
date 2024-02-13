import { Button } from 'antd';
import React from 'react'
import  FileViewer  from 'react-file-viewer';
import { useLocation } from 'react-router';
import { backendURL } from '../../Constants';


export default function FileType({questionId, submissionId}) {
    const queryParams = new URLSearchParams(useLocation().search);

    const downloadPDF = () => {
		fetch(`${backendURL}/get_submitted_file?questionId=${questionId}&submissionId=${submissionId}&token=${localStorage.getItem('JWTtoken')}`)
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = "Submission.pdf" ;
					a.click();
				});
		});
	}

    return (
        <>
            <Button onClick={downloadPDF} style={{marginTop: "10px", marginLeft: '10px'}} type="primary"  >
                Download PDF
            </Button>
            <FileViewer
                controls={true}
                fileType={"pdf"}
                filePath={`${backendURL}/get_submitted_file?questionId=${questionId}&submissionId=${submissionId}&token=${localStorage.getItem('JWTtoken')}`}
                key={submissionId + questionId}
            />
        </>
    )
}