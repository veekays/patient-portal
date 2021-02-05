import React, { Component } from 'react';
import { Button, Toast, Card, Table, Heading, Column } from '@innovaccer/design-system';
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
            loading: true,
            uploading : false
        }
    }

    componentDidMount() {
        this.getPatientData();
    }
    getPatientData(options) {
        this.setState({
            loading: true
        })
        return getPatient(options)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ loading: false })
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
        this.setState({
            uploading:true
        })
        uploadData(this.state.selectedFile)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({
                        visible: true,
                        uploading : false,
                        message: result.data.message
                    })
                    setTimeout(() => {
                        this.setState({
                            visible: false,
                        })
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

    errorTemplate(props) {
        const { errorType = 'DEFAULT' } = props;
        const errorMessages = {
            'FAILED_TO_FETCH': 'Failed to fetch data',
            'NO_RECORDS_FOUND': 'No results found',
            'DEFAULT': 'No results found'
        }
        return (
            <Column size={"12"} className="justify-content-center align-item-center d-flex p-10">
                <Heading>{errorMessages[errorType]}</Heading>
            </Column>
        );
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
                {
                    !this.state.uploading &&
                    <Table loaderSchema={schema} type="resource" fetchData={this.getPatientData.bind(this)} pageSize={5} withHeader={true} headerOptions={{ withSearch: true }} onRowClick={(rowIndex) => this.handleRow(rowIndex)} errorTemplate={this.errorTemplate} loading={this.state.loading} />
                }
            </div>
        )
    }

}