import React, { Component } from "react";
import io from "socket.io-client";
import Axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://localhost:5000"
    };
  }

  componentDidMount() {
    const { url } = this.state;
    const socket = io(url);
    socket.on("connected", data => console.log(data));
    // this.getData();
  }

  getData = async () => {
    const { url } = this.state;
    const data = await Axios.get(url);
    console.log(data);
  };

  render() {
    return (
      <React.Fragment>
        <h2>Hello</h2>
      </React.Fragment>
    );
  }
}

export default App;
