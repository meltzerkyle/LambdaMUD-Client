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
import Pusher from "pusher-js";

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
      <div>
        {this.state.loadedSuccessfully === true ? (
          <div>
            <div>GAMEWORLD</div>
            <div>
              You, {this.state.name}, are in the {this.state.roomTitle}.{" "}
              {this.state.roomDescription}
            </div>
            <div>
              Other players in the room:
              {this.state.players.map(player => (
                <div key={player}>{player}</div>
              ))}
            </div>
          </div>
        ) : (
          <div>GAMEWORLD LOADING...</div>
        )}
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
        <Card>{this.state.message}</Card>
      </div>
    );
  }
}

// {
//   this.state.errorMessage !== null ? (
//     <h3 style={{ color: "red" }}>{this.state.errorMessage}</h3>
//   ) : null;
// }

export default Game;
