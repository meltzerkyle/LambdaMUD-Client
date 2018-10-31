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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleLogin = event => {
    event.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post("https://kylemud.herokuapp.com/api/login", user)
      .then(response => {
        localStorage.setItem("token", response.data.key);
        this.props.history.push("/game");
      })
      .catch(error => alert(error.response.data.error));
    this.setState({
      username: "",
      password: ""
    });
  };
  render() {
    return (
      <Row className="justify-content-center">
        <Col sm="6" md="4">
          <Card>
            <CardBody>
              <CardTitle>Login Screen</CardTitle>
              <Form onSubmit={this.handleLogin}>
                <FormGroup>
                  <Label>Username</Label>
                  <Input
                    onChange={this.handleInputChange}
                    placeholder="Enter username"
                    value={this.state.username}
                    name="username"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    onChange={this.handleInputChange}
                    placeholder="Enter password"
                    value={this.state.password}
                    name="password"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Button color="primary" type="submit">
                    Login
                  </Button>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Login;
