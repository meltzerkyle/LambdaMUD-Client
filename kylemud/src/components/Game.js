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
      roomDescription: ""
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
          roomDescription: response.data.description
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

    channel.bind("my-event", function(data) {
      alert(JSON.stringify(data));
    });

    console.log('test string')
  }
  render() {
    return (
      <div>
        <div>GAMEWORLD</div>
        <div>
          You, {this.state.name}, are in the {this.state.roomTitle}.{" "}
          {this.state.roomDescription}
        </div>
        <div>
          Other players in the room:
          {this.state.players.map(player => (
            <div>{player}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default Game;
