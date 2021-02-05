import React, { Component } from 'react';
import { Button, Toast, Card, Table } from '@innovaccer/design-system';
import { uploadData, getPatient } from "../api"

const schema = [
    {
        name: "id",
        displayName: "ID"
    },
    {
        name: "name",
        displayName: "Name"
    },
    {
        name: "age",
        displayName: "Age"
    },
    {
        name: "gender",
        displayName: "Gender"
    },
    {
        name: "contact",
        displayName: "Contact"
    },
]
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            selectedFile: null,
            visible: false,
            message: "",
        }
    }

    componentDidMount() {
        this.getPatientData();
    }

    getPatientData(options) {
        return getPatient(options)
            .then((result) => {
                if (result.status === 200) {
                    return result.data.patient_list
                }
            })
    }

    onChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    onClickHandler = () => {
        uploadData(this.state.selectedFile)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({
                        visible: true,
                        message: result.data.message
                    })
                    setTimeout(() => {
                        this.setState({
                            visible: false
                        })
                        this.getPatientData()
                    }, 5000)
                }
            })
    }

    handleClose = () => {
        this.setState({
            visible: false
        })
    }

    handleRow(data) {
        this.props.history.push(`/patient/${data.id}`)
    }

    render() {
        return (
            <div className="wrapper">
                <div className="greeting-text">
                    <h2>Welcome to patient portal</h2>
                    <p>Please Upload CSV file to fetch patient list</p>
                </div>
                <div className="file-uploader">
                    <input type="file" className="choose" name="file" accept=".csv" onChange={this.onChangeHandler} />
                    <Button type="button" appearance="primary" size="large" onClick={this.onClickHandler}>Upload</Button>
                </div>
                {
                    this.state.visible &&
                    <div className="toast-wrapper">
                        <Toast appearance="success" title={this.state.message} onClose={this.handleClose} />
                    </div>
                }
                <Table loaderSchema={schema} type="resource" fetchData={this.getPatientData} pageSize={5} withHeader={true} headerOptions={{ withSearch: true }} onRowClick={(rowIndex) => this.handleRow(rowIndex)} />
            </div>
        )
    }

}