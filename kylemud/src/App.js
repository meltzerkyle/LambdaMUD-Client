import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";
import { Container } from "reactstrap";

import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    };
  }
  render() {
    return (
      <Container className="App" fluid={true}>
        <Route path="/register" render={props => <Register {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
      </Container>
    );
  }
}

export default withRouter(App);
