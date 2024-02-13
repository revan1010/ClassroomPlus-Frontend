import React from 'react'
import useWindowDimensions from '../../Components/WindowDimensions';
import DescriptionEditor from '../../TextEditor/MyTextEditor';

export default function QuestionPreview({title, description, sample}) {
    const { height, width } = useWindowDimensions();

    return (
        <div style={{height: (height - 70) + "px", padding: '10px' }}>
            <div className="outer-scroll-div">
                <div className="question-title" style={{width: '90%', borderBottom: 'none', marginBottom: "0px"}}> 
                    {title} 
                </div>
                <DescriptionEditor state={description} setState={() => {}} readOnly={true} />

                <h3 className="question-sample-case-title" style={{marginTop: '10px'}} hidden={sample.input.length === 0}>Sample Input</h3>
                <div className="question-sample-case-input" style={{whiteSpace: 'pre'}} hidden={sample.input.length === 0} >
                    {sample.input}
                </div>
                <h3 className="question-sample-case-title" hidden={sample.output.length === 0} >Sample Output</h3>
                <div className="question-sample-case-input" style={{whiteSpace: 'pre'}} hidden={sample.output.length === 0}>
                    {sample.output}
                </div>
                <h3 className="question-sample-case-title" hidden={sample.explanation.length === 0}>Explanation</h3>
                <div className="question-sample-case-input" style={{whiteSpace: 'pre'}} hidden={sample.explanation.length === 0}>
                    {sample.explanation}
                </div>

            </div>
        </div>
    )
}
