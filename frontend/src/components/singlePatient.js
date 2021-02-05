import React from 'react'
import { getPatientProfile } from '../api'
import { Card } from '@innovaccer/design-system'
import { Link } from "react-router-dom"
import Avatar from '../static-content/img/avatar.png'


export default class PatientProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            patientProfile: {}
        }
    }
    componentDidMount() {
        this.getPatientProfileData()
    }

    getPatientProfileData() {
        let params = this.props.match.params.id
        return getPatientProfile(params)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ patientProfile: result.data })
                    return result.data
                }
            })
    }

    render() {
        const { patientProfile } = this.state;
        return (
            <div className="patient-profile-container">
                <div className="link-wrapper">
                    <Link to="/" className="back-link">&#8617; Back</Link>
                </div>
                <div className="card-wrapper">
                    <Card className="p-6 card-style">
                        <div className="patient-profile-text">
                            <h4>Patient Profile</h4>
                        </div>
                        <div className="patient-detail">
                            <div className="profile-pic">
                                <img src={Avatar} alt="Avatar" />
                            </div>
                            <div className="profile-data">
                                <h4>Name : <span>{patientProfile.name}</span></h4>
                            </div>
                            <div className="profile-data">
                                <h4>Age : <span>{patientProfile.age}</span></h4>
                            </div>
                            <div className="profile-data">
                                <h4>Gender : <span>{patientProfile.gender}</span></h4>
                            </div>
                            <div className="profile-data">
                                <h4>Contact : <span>{patientProfile.contact}</span></h4>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <h4>Note : <span>This patient has suffered from serious illness. Medical urgency required</span></h4>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}