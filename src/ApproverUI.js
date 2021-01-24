import React, { useState } from 'react';
import axios from 'axios';

export default function ApproverUI() {
    const [requestsList, setrequestsList] = useState([]);

    async function getRequests() {
        await axios.get(`${process.env.REACT_APP_API}/task?candidateGroup="baazhr"`)
            .then(response => {
                let newlist =[] 
                response.data.map(async (el, i) => {
                    new Promise((resolve, reject) => {
                        resolve(getInstanceVariables(el.executionId))
                    })
                    .then(res => {
                        newlist=[...newlist, { ...el, variables: res }] 
                    })
                    .then(()=>{
                        if (i+1 ===response.data.length){
                            console.log('newww',newlist);
                            setrequestsList(newlist);
                        }
                    })
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    async function getInstanceVariables(execId) {
        let variab = await axios.get(`${process.env.REACT_APP_API}/process-instance/${execId}/variables`)
            .catch(function (error) {
                console.log(error);
            })
        return variab.data
    }
    async function handleReviewRequest(bool, execId){
        await axios.post(`${process.env.REACT_APP_API}/task/${execId}/complete`, {
            "variables": {
                "approved": { "value": bool, "type": "Boolean" }
            }
        })
            .then(()=> getRequests())
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <div>
            <button onClick={() => getRequests()}>
                get requests
            </button>
            {requestsList.map(el =>
                <div>
                    <p>{`${el.variables.employee.value} : from day ${el.variables.D1.value} to day ${el.variables.D2.value} for ${el.variables.reason.value}`}</p>
                    <button onClick={() => handleReviewRequest(true, el.id)}>
                        accept
                    </button>
                    <button onClick={() => handleReviewRequest(false, el.id)}>
                        reject
                    </button>
                </div>
            )}
        </div>
    );
}