import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };
  componentDidMount() {
    // check if user is in session
    debugger;
    if (sessionStorage.getItem("user") === "parent") {
      this.userHasAuthenticated(true);
      this.setState({ isAuthenticating: false });
    }
  }
  handleLogout() {
    this.userHasAuthenticated(false);
    sessionStorage.removeItem("user");
    this.props.history.push("/login");
  }
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      // !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect
          className="navbar navbar-dark device-nav-bar fixed-top"
        >
          <Link className="navbar-brand" to="/">
            Manage Wireless Devices
          </Link>
          {!this.state.isAuthenticated && (
              <NavItem>
                {/* <button className="btn btn-dark signIn-btn">Sign In</button> */}
              </NavItem>
          )}
          {this.state.isAuthenticated && (
            <NavItem>
              <div>
              <span class="list-group-item person-icon" href="#">
                <i class="fa fa-user fa-lg" aria-hidden="true"></i>
                </span>
                         <label className="mr-2 text-white">uju</label>
                <button
                  className="btn btn-dark signIn-btn"
                  onClick={this.handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </NavItem>
          )}
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}
export default withRouter(App);
