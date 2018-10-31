import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: ""
    };
  }
  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleRegister = event => {
    event.preventDefault();
    const user = {
      username: this.state.username,
      password1: this.state.password1,
      password2: this.state.password2
    };
    axios
      .post("https://kylemud.herokuapp.com/api/registration", user)
      .then(response => {
        localStorage.setItem("token", response.data.key);
        this.props.history.push("/game");
      })
      .catch(error => console.error("Error:", error));
    this.setState({
      username: "",
      password1: "",
      password2: ""
    });
  };
  render() {
    return (
      <Row className="justify-content-center">
        <Col sm="6" md="4">
          <Card>
            <CardBody>
              <CardTitle>Create Account</CardTitle>
              <Form onSubmit={this.handleRegister}>
                <FormGroup>
                  <Label>Username</Label>
                  <Input
                    onChange={this.handleInputChange}
                    placeholder="Select username"
                    value={this.state.username}
                    name="username"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    onChange={this.handleInputChange}
                    placeholder="Select password"
                    value={this.state.password1}
                    name="password1"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input
                    onChange={this.handleInputChange}
                    placeholder="Re-enter password"
                    value={this.state.password2}
                    name="password2"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                <Button color="primary" type="submit">Connect</Button>    
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Register;
