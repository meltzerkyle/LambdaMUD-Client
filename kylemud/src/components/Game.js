import React, { Component } from "react";
import axios from "axios";

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
        this.setState({
          players: response.data.players
        });
      })
      .catch(error => alert(error.response.data.error));
  }
  render() {
    return (
      <div>
        hello game
        <div>
          {this.state.players.map(player => (
            <div>{player}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default Game;
