import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


function EmployeeUI() {
    const classes = useStyles();

    const [processStep, setprocessStep] = useState("start");
    const [processId, setprocessId] = useState();
    const [execId, setexecId] = useState();

    const [employee, setemployee] = useState();
    const [D1, setD1] = useState();
    const [D2, setD2] = useState();
    const [reason, setreason] = useState();

    async function getTaskByExecId(execId) {
        let resTask = await axios.get(`${process.env.REACT_APP_API}/task?executionId=${execId}`)
            .catch(function (error) {
                console.log(error);
            })
        return resTask.data[0]
    }

    async function handleStartRequest() {
        await axios.post(`${process.env.REACT_APP_API}/process-definition/key/${process.env.REACT_APP_PROCESS}/start`, {
            "variables": {
                "employee": { "value": "default", "type": "String" },
                "team": { "value": "developer", "type": "String" }
            }
        })
            .then(function (response) {
                setexecId(response.data.id)
                getTaskByExecId(response.data.id).then(async (res) => {
                    setprocessId(res.id)
                    setprocessStep(res.name);
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    async function handleSubmitForm(event) {
        event.preventDefault();
        await axios.post(`${process.env.REACT_APP_API}/task/${processId}/complete`, {
            "variables": {
                "employee": { "value": employee, "type": "String" },
                "D1": { "value": D1, "type": "String" },
                "D2": { "value": D2, "type": "String" },
                "reason": { "value": reason, "type": "String" }
            }
        })
            .then(function (response) {
                getTaskByExecId(execId).then(async (res) => {
                    setprocessId(res.id)
                    setprocessStep(res.name);
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    async function handleReviewRejection(bool) {
        await axios.post(`${process.env.REACT_APP_API}/task/${processId}/complete`, {
            "variables": {
                "withdrawed": { "value": bool, "type": "Boolean" }
            }
        })
            .then(function (response) {
                getTaskByExecId(execId).then(async (res) => {
                    setprocessId(res.id)
                    setprocessStep(res.name);
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    async function handleRefreshRequest() {
        getTaskByExecId(execId).then(async (res) => {
            setprocessId(res.id)
            setprocessStep(res.name);
        });
    }

    return (
        <div>
            <h4> Employee UI </h4>
            {processStep === "start" &&
                <button onClick={() => handleStartRequest()}>
                    Start a vacation request
                </button>
            }
            {processStep === "submit form" &&
                <form onSubmit={handleSubmitForm} className={classes.container}>
                    <TextField
                        id="employee"
                        label="Employee name:"
                        type="text"
                        value={employee}
                        onChange={e => setemployee(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="D1"
                        label="Starting day:"
                        type="date"
                        defaultValue={new Date()}
                        value={D1}
                        onChange={e => setD1(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="D2"
                        label="Ending day:"
                        type="date"
                        defaultValue={new Date()}
                        value={D2}
                        onChange={e => setD2(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="reason"
                        label="Reason of vacation:"
                        type="text"
                        value={reason}
                        onChange={e => setreason(e.target.value)}
                        className={classes.textField}
                    />
                    <input type="submit" value="Submit" />
                </form>
            }
            {processStep === "review request" &&
                <div>
                    <h1>Request sent to HR</h1>
                    <button onClick={() => handleRefreshRequest()}>
                        refresh
                    </button>
                </div>
            }
            {processStep === "approved" &&
                <h1>Vacation request approved</h1>
            }
            {processStep === "review rejection" &&
                <div>
                    <h1>Do you want to edit your input or withdraw your request ?</h1>
                    <button onClick={() => handleReviewRejection(false)}>
                        Edit input
                    </button>
                    <button onClick={() => handleReviewRejection(true)}>
                        Withdraw request
                    </button>
                </div>
            }
            {processStep === "edit inputs" &&
                <form onSubmit={handleSubmitForm} className={classes.container}>
                    <TextField
                        id="D1"
                        label="Starting day:"
                        type="date"
                        defaultValue={new Date()}
                        value={D1}
                        onChange={e => setD1(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="D2"
                        label="Ending day:"
                        type="date"
                        defaultValue={new Date()}
                        value={D2}
                        onChange={e => setD2(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="reason"
                        label="Reason of vacation:"
                        type="text"
                        value={reason}
                        onChange={e => setreason(e.target.value)}
                        className={classes.textField}
                    />
                    <input type="submit" value="Submit" />
                </form>
            }
            {processStep === "withdraw" &&
                <h1>Vacation request withdrawed</h1>
            }

        </div>
    );
}

export default EmployeeUI;