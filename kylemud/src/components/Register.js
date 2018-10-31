import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import axios from "axios";

class Register extends Component {
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
  handleRegister = event => {
    event.preventDefault();
    const user = {
      username: this.state.username,
      password1: this.state.password,
      password2: this.state.password
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
      password: ""
    });
  };
  render() {
      return(
          <Row className="justify-content-center">
            Kitty!
          </Row>
      )
  }
}

export default Register;
