import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Button } from "react-bootstrap";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    // make a call , this.state.email, this.state.password
    setTimeout(
      () => {axios.get('/api/login').then(response => {
        this.props.userHasAuthenticated(true);
        sessionStorage.setItem('user', 'parent');
        this.props.history.push({
          pathname: '/DeviceList',
          state: { user: response.data.user }
        })
      }
      );
    },0);
  };

  render() {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 mx-auto">
                <div className="card rounded-0">
                  <div className="card-header">
                    <h3 className="mb-0">Login</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="email" bsSize="large">
                        {/* <ControlLabel>Email</ControlLabel> */}
                        <FormControl
                          autoFocus
                          type="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          placeholder="username or email"
                        />
                      </FormGroup>
                      <FormGroup controlId="password" bsSize="large">
                        {/* <ControlLabel>Password</ControlLabel> */}
                        <FormControl
                          value={this.state.password}
                          onChange={this.handleChange}
                          type="password"
                          placeholder="password"

                        />
                      </FormGroup>
                      <LoaderButton
                      block
                      bsSize="large"
                      disabled={!this.validateForm()}
                      type="submit"
                      isLoading={this.state.isLoading}
                      text="Login"
                      loadingText="Logging in…"
                    />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
