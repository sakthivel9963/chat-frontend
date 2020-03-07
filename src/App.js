import React, { Component } from "react";
import io from "socket.io-client";
import moment from "moment";
// import Axios from "axios";
import "./index.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {
        userName: "",
        userId: "",
        timeStamp: "",
        isTyping: false
      },
      url: process.env.REACT_APP_API_URL,
      message: "",
      userDetailsList: [],
      userMessageList: []
    };
  }

  componentDidMount() {
    this.index();
  }

  index = async () => {
    const { url, userMessageList } = this.state;
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
      userMessageList.push(data);
      this.setState({
        userMessageList
      });
      const messageDetails = document.querySelector("#message-details");
      messageDetails.scrollIntoView();
    });
  };

  sendMessage = () => {
    const { message, userDetails } = this.state;
    const { url } = this.state;
    const socket = io(url);
    if (message && message.trim()) {
      const data = {
        message,
        userName: userDetails.userName,
        userId: userDetails.userId,
        time: Date.now()
      };
      socket.emit("sendMessage", data);
      this.setState({
        message: ""
      });
    }
  };

  getValue = e => {
    this.setState({
      message: e.target.value
    });
  };

  getKeyPress = e => {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.sendMessage();
    }
  };

  render() {
    const {
      userDetails,
      userDetailsList,
      message,
      userMessageList
    } = this.state;
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
                            <div className="card-body">
                              {userDetails.userId === value.userId
                                ? `You`
                                : value.userName}
                            </div>
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
                  {userMessageList &&
                    userMessageList.length > 0 &&
                    userMessageList.map((value, index) => {
                      return (
                        <li key={value.userId + index}>
                          <div className="card">
                            <div className="card-body">
                              {" "}
                              <span>
                                <span>
                                  {userDetails.userId === value.userId
                                    ? `You`
                                    : value.userName}{" "}
                                  :{" "}
                                </span>{" "}
                                {value.message}{" "}
                              </span>
                              <span>
                                {moment(value.time).format(
                                  "DD/MM/YYYY, h:mm:ss a"
                                )}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <span id="message-details"></span>
              </div>
              <div className="user-input">
                <div className="input-group mb-3">
                  <textarea
                    className="form-control resize"
                    placeholder="Enter Message"
                    aria-label="message"
                    aria-describedby="basic-addon2"
                    id="message"
                    name="message"
                    onChange={this.getValue}
                    onKeyDown={this.getKeyPress}
                    value={message}
                    rows={1}
                    wrap="hard"
                    autoFocus
                  ></textarea>
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
