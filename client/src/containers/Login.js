// TODO: see if u can remnove isLoading
// and check loaderbutton
    //TODO: set timeout 1000 ms to show loading spinner

import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";
import axios from "axios";
// import LoaderButton from "../components/LoaderButton";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      passwordError: null,
      userNameError: null,
      usernamePwdError: null
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  _validateForm() {
    const { passwordError } = this.state;
    if (this.state.password.length < 5) {
      this.setState({
        passwordError: "Please enter at least 5 characters."
      });
      return false;
    }
    return true;
  }
  handleSubmit = event => {
    event.preventDefault();
    if (!this._validateForm()) {
      return;
    }
    this.setState({ isLoading: true });
    axios
      .post("/v1/session/", {
        username: this.state.email,
        password: this.state.password
      })
      .then(response => {
        const data = response.data;
        this.props.userHasAuthenticated(data.auth);
        localStorage.setItem("authToken", data.token);
        this.props.history.push({
          pathname: "/DeviceList",
          state: { role: data.role }
        });
      })
      .catch(response => {
        const res = response.response;
        if (res.status === 404 && res.statusText === "Not Found"){
          this.setState({
            userNameError: "There is no account for the username or email you entered"
          });
        }
        if (res.status === 401 && res.statusText === "Unauthorized"){
          this.setState({
            usernamePwdError: "The username and/or password you provided are incorrect"
          });
        }
        if (!res.data.auth){
          this.props.userHasAuthenticated(false);
        }
      });
  };

  renderError(elm) {
    const { userNameError, passwordError } = this.state;
    if (passwordError && elm === 'password') {
      return <div className="help-block">{passwordError}</div>;
    }
    if (userNameError && elm === 'username') {
      return <div className="help-block">{userNameError}</div>;
    }
    return null;
  }
  errorClass(error) {
    let elm = error ? "has-error" : "";
    return elm;
  }
  render() {
    const { passwordError, userNameError, usernamePwdError } = this.state;
    return <div className="container loginWrapper">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card rounded">
              <div className="card-header">
                <h3 className="mb-0">Login</h3>
              </div>
              <div className="card-body">
                <Form horizontal onSubmit={this.handleSubmit}>
                  <FormGroup controlId="email">
                    <Col componentClass={ControlLabel} sm={5}>
                      Username
                    </Col>
                    <Col sm={10}>
                      <FormControl className={`form-group ${this.errorClass(userNameError)}`} autoFocus type="email" required autoComplete="email" value={this.state.email} onChange={this.handleChange} placeholder="username or email" />
                      {this.renderError("username")}
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="password" className={`form-group ${this.errorClass(passwordError)}`}>
                    <Col componentClass={ControlLabel} sm={5}>
                      Password
                    </Col>
                    <Col sm={10}>
                      <FormControl value={this.state.password} onChange={this.handleChange} type="password" required value={this.state.password} placeholder="password" />
                      {this.renderError("password")}
                    </Col>
                  </FormGroup>
                  {usernamePwdError &&
                  <div class="alert alert-danger" role="alert">
                    {usernamePwdError}
                  </div>}
                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <Button block bsSize="large" className="btn-dark signIn-btn" type="submit" text="Sign In">
                        Sign In
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
}

export default Login;
