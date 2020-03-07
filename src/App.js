import React, { Component } from "react";
import io from "socket.io-client";
import Axios from "axios";
import "./index.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {
        userName: null,
        userId: null,
        timeStamp: null
      },
      url: process.env.REACT_APP_API_URL,
      message: null,
      userDetailsList: null
    };
  }

  componentDidMount() {
    this.index();
  }

  index = async () => {
    const { url } = this.state;
    const socket = io(url);
    const userName = prompt("Please enter your name");
    socket.on("connected", data => {
      const userDetails = {
        userName,
        userId: data,
        timeStamp: Date.now()
      };
      socket.emit("sendUserDetails", userDetails);
      this.setState({
        userDetails
      });
    });
    socket.on("getUserDetails", data => {
      this.setState({ userDetailsList: data });
    });
    socket.on("getMessage", data => {
      console.log(data);
    });
  };

  getValue = e => {
    this.setState({
      message: e.target.value
    });
  };

  sendMessage = () => {
    const { message, userDetails } = this.state;
    const { url } = this.state;
    const socket = io(url);
    const data = {
      message,
      userDetails
    };
    socket.emit("sendMessage", data);
    this.setState({
      message: null
    });
  };

  render() {
    const { userDetailsList } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row set-height py-4">
            <div className="col-4 border reset-padding">
              <div className="user-details border border-top-1">
                <ul>
                  {userDetailsList &&
                    userDetailsList.length > 0 &&
                    userDetailsList.map(value => {
                      return (
                        <li key={value.userId}>
                          <div className="card">
                            <div className="card-body">{value.userName}</div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="col-8 border reset-padding">
              <div className="user-details border border-top-1">
                <ul>
                  <li>
                    <div className="card">
                      <div className="card-body">Sakthivel</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="user-input">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Message"
                    aria-label="message"
                    aria-describedby="basic-addon2"
                    id="message"
                    name="message"
                    onChange={this.getValue}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={this.sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
