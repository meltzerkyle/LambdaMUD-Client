import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import axios from "axios";
import Pusher from "pusher-js";
import classNames from "classnames";

import "./Game.css";

const gameClasses = classNames({
  game: true,
  "justify-content-center": true
  //   "align-items-center": true
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      name: "",
      roomTitle: "",
      roomDescription: "",
      loadedSuccessfully: false,
      message: "",
      command: ""
    };
  }
  componentDidMount() {
    const header = {
      headers: {
        authorization: `TOKEN ${localStorage.getItem("token")}`
      }
    };
    axios
      .get("https://kylemud.herokuapp.com/api/adv/init/", header)
      .then(response => {
        console.log(response);
        this.startPusher(response.data.uuid);
        this.setState({
          players: response.data.players,
          name: response.data.name,
          roomTitle: response.data.title,
          roomDescription: response.data.description,
          loadedSuccessfully: true
        });
      })
      .catch(error => alert(error.response.data.error));
  }
  startPusher(id) {
    let pusher = new Pusher("5fe57c4fbb2708238bac", {
      cluster: "us2",
      forceTLS: true
    });

    let channel = pusher.subscribe(`p-channel-${id}`);

    channel.bind(
      "broadcast",
      function(data) {
        console.log(data);
        //   alert(JSON.stringify(data));
        this.setState({
          message: data.message,
          players: data.players
        });
      }.bind(this)
    );
  }
  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCommand = event => {
    event.preventDefault();
    const header = {
      headers: {
        authorization: `TOKEN ${localStorage.getItem("token")}`
      }
    };
    let commands = this.state.command.split(" ");
    console.log(commands);
    if (commands.length >= 2) {
      console.log(commands[0]);
    }
    let command = {
      message: this.state.command
    };
    if (commands[0] === "move") {
      command = {
        direction: commands[1]
      };
      axios
        .post(
          `https://kylemud.herokuapp.com/api/adv/${commands[0]}/`,
          command,
          header
        )
        .then(response => {
          console.log(response);
          this.setState({
            players: response.data.players,
            name: response.data.name,
            roomTitle: response.data.title,
            roomDescription: response.data.description,
            loadedSuccessfully: true
          });
        })
        .catch(error => alert("Please enter a valid command!"));
    }
    axios
      .post(
        `https://kylemud.herokuapp.com/api/adv/${commands[0]}/`,
        command,
        header
      )
      .then(response => {
        console.log(response);
        this.setState({ message: response.data.message });
      })
      .catch(error => alert("Please enter a valid command!"));
    //   .catch(error => alert(error.response.data.error));
  };
  render() {
    return (
      <Row className={gameClasses}>
        {this.state.loadedSuccessfully === true ? (
          <Col sm="8">
            <Row className="justify-content-center">
              <Col sm="8">
                <div style={{ minHeight: "10em" }}>
                  <div>WELCOME TO R'LYEH</div>
                  {this.state.roomTitle}. {this.state.roomDescription}
                </div>
                <Col>
                  <Card
                    style={{
                      minHeight: "20em",
                      overflow: "scroll"
                    }}
                  >
                    <CardBody style={{ backgroundColor: "lightGray", opacity: "0.6" }}>
                      <CardTitle>MESSAGES</CardTitle>
                      <div className="text-muted">{this.state.message}</div>
                    </CardBody>
                  </Card>
                </Col>
                <Form onSubmit={this.handleCommand}>
                  <FormGroup>
                    <Label>COMMAND</Label>
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Enter command"
                      value={this.state.command}
                      name="command"
                      type="text"
                    />
                  </FormGroup>
                </Form>
              </Col>
              <Col sm="4">
                <div style={{ minHeight: "10em" }}>
                  Your name is {this.state.name}. You don't remember how you got
                  here...
                </div>
                <div>
                  Other players in the room:
                  {this.state.players.map(player => (
                    <div key={player}>{player}</div>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col>R'LYEH LOADING...</Col>
        )}
      </Row>
    );
  }
}

// {
//   this.state.errorMessage !== null ? (
//     <h3 style={{ color: "red" }}>{this.state.errorMessage}</h3>
//   ) : null;
// }

export default Game;
