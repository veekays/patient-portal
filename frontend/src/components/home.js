import React, { Component } from "react";
import {
    Button,
    Toast,
    Modal,
    Table,
    Input,
    Heading,
    Column,
    Text,
    Breadcrumbs,
    PageHeader,
    Row,
    Card,
} from "@innovaccer/design-system";
import { uploadData, getPatient } from "../api";

const schema = [
    {
        name: "id",
        displayName: "ID",
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "age",
        displayName: "Age",
    },
    {
        name: "gender",
        displayName: "Gender",
    },
    {
        name: "contact",
        displayName: "Contact",
    },
];
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            selectedFile: null,
            visible: false,
            message: "",
            loading: true,
            uploading: false,
            modalOpen: false,
        };
    }

    componentDidMount() {
        this.getPatientData();
    }
    getPatientData(options) {
        this.setState({
            loading: true,
        });
        return getPatient(options).then((result) => {
            if (result.status === 200) {
                this.setState({ loading: false });
                return result.data.patient_list;
            }
        });
    }

    onChangeHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    };

    onClickHandler = () => {
        this.setState({
            uploading: true,
        });
        uploadData(this.state.selectedFile).then((result) => {
            if (result.status === 200) {
                this.setState({
                    visible: true,
                    uploading: false,
                    message: result.data.message,
                });
                setTimeout(() => {
                    this.setState({
                        visible: false,
                    });
                }, 5000);
            }
        });
    };

    handleClose = () => {
        this.setState({
            visible: false,
        });
    };

    handleRow(data) {
        this.props.history.push(`/patient/${data.id}`);
    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen,
        });
    }

    errorTemplate(props) {
        const { errorType = "DEFAULT" } = props;
        const errorMessages = {
            FAILED_TO_FETCH: "Failed to fetch data",
            NO_RECORDS_FOUND: "No results found",
            DEFAULT: "No results found",
        };
        return (
            <Column
                size={"12"}
                className="justify-content-center align-item-center d-flex p-10"
            >
                <Heading>{errorMessages[errorType]}</Heading>
            </Column>
        );
    }

    render() {
        const { modalOpen } = this.state;
        const title = "Patient portal";
        const breadcrumbData = [
            {
                label: "Home",
                link: "/",
            },
        ];
        const options = {
            title,

            breadcrumbs: (
                <Breadcrumbs
                    list={breadcrumbData}
                    onClick={(link) => console.log(link)}
                />
            ),
            actions: (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button appearance="primary" onClick={this.toggleModal.bind(this)}>
                        Add patients
          </Button>
                </div>
            ),
        };

        return (
            <div className="d-flex flex-column bg-secondary-lightest vh-100">
                <PageHeader {...options} />
                <Row className="px-6 h-100 py-6">
                    <Column className="h-100 v-100 bg-light">
                        <Modal
                            open={modalOpen}
                            dimension="small"
                            onClose={this.toggleModal.bind(this)}
                            headerOptions={{
                                heading: "Add patients",
                                subHeading: "Please upload a csv file only.",
                            }}
                            footer={
                                <>
                                    <Button
                                        appearance="basic"
                                        onClick={this.toggleModal.bind(this)}
                                    >
                                        Cancel
                  </Button>
                                    <Button
                                        appearance="primary"
                                        className="ml-4"
                                        onClick={this.onClickHandler.bind(this)}
                                    >
                                        Upload
                  </Button>
                                </>
                            }
                        >
                            <Text>Patients you upload will be listed on your home page.</Text>
                            <div className="pt-4">
                                <Input
                                    type="file"
                                    className="file-input"
                                    name="file"
                                    accept=".csv"
                                    onChange={this.onChangeHandler}
                                />
                            </div>
                        </Modal>

                        {this.state.visible && (
                            <div className="toast-wrapper">
                                <Toast
                                    appearance="success"
                                    title={this.state.message}
                                    onClose={this.handleClose}
                                />
                            </div>
                        )}
                        <Card className="overflow-hidden h-100">
                            <div>

                                {!this.state.uploading && (
                                    <Table
                                        loaderSchema={schema}
                                        type="resource"
                                        fetchData={this.getPatientData.bind(this)}
                                        pageSize={10}
                                        withHeader={true}
                                        headerOptions={{ withSearch: true }}
                                        onRowClick={(rowIndex) => this.handleRow(rowIndex)}
                                        errorTemplate={this.errorTemplate}
                                        loading={this.state.loading}
                                    />
                                )}
                            </div>

                        </Card>
                    </Column>
                </Row>
            </div>
        );
    }
}
