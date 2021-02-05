import React from "react";
import { getPatientProfile } from "../api";
import {
  Card,
  Breadcrumbs,
  Row,
  Button,
  PageHeader,
  Column,
  Heading,
} from "@innovaccer/design-system";
import Avatar from "../static-content/img/avatar.png";
import { withRouter } from "react-router-dom";

class PatientProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      patientProfile: {},
    };
  }
  componentDidMount() {
    this.getPatientProfileData();
  }

  getPatientProfileData() {
    let params = this.props.match.params.id;
    return getPatientProfile(params).then((result) => {
      if (result.status === 200) {
        this.setState({ patientProfile: result.data });
        return result.data;
      }
    });
  }

  render() {
    const { patientProfile } = this.state;

    // const navigationPosition = 'center';
    const title = patientProfile.name;

    const breadcrumbData = [
      {
        label: "Home",
        link: "/",
      },
      {
        label: "Patient Profile",
        link: `/patient/${patientProfile.id}`,
      },
    ];

    const options = {
      title,

      breadcrumbs: (
        <Breadcrumbs
          list={breadcrumbData}
          onClick={(link) => this.props.history.push(link)}
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
          <Button
            appearance="basic"
            size="tiny"
            onClick={() => this.props.history.push("/")}
          >
            Back to dashboard
          </Button>
        </div>
      ),
    };
    return (
      <div className="d-flex flex-column bg-secondary-lighter vh-100 overflow-hidden">
        <PageHeader {...options} />
        <Row className="px-6 h-100 py-6 justify-content-center">
          <Column
            className="h-100 v-100 pt-8"
            size="4"
            sizeXS="12"
            sizeS="10"
            sizeM="8"
          >
            <Card shadow="dark" className="bg-light">
              <div className="p-5">
                <Heading>Patient Profile</Heading>
                <Row>
                  <Column size="4">
                    <img className="w-100" src={Avatar} alt="Avatar" />
                  </Column>
                  <Column size="8">
                    <div className="pl-8">
                      {Object.keys(patientProfile).map((item, index) => {
                        return (
                          <Heading className="pb-4" size="s" key={index}>
                            <span className="Text--subtle Text--Capitalize">
                              {" "}
                              {item} :
                            </span>{" "}
                            {patientProfile[item]}
                          </Heading>
                        );
                      })}
                    </div>
                  </Column>
                </Row>

                <hr />
                <div>
                  <h4>
                    Note :{" "}
                    <span>
                      This patient has suffered from serious illness. Medical
                      urgency required
                    </span>
                  </h4>
                </div>
              </div>
            </Card>
          </Column>
        </Row>
      </div>
    );
  }
}

export default withRouter(PatientProfile);
