import React, { Component } from "react";
import { Form, FormGroup, Col, ControlLabel, FormControl, Button } from "react-bootstrap";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      passwordError: ""
    };
  }

  // validateForm() {
  //   return this.state.email.length > 0 && this.state.password.length > 0
  // }

  handleChange = e => {
    // this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]:  '' })
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  _validateForm(){
    const { passwordError } = this.state;

        if (this.state.password.length < 5) {
          this.setState({
            passwordError: 'Please enter at least 5 characters.'
          })
          return false;


  }
  return true;
}

  handleSubmit = event => {
    event.preventDefault();
    if (!this._validateForm()){
      return;
    }
    this.setState({ isLoading: true });
    this.props.userHasAuthenticated(true);
    sessionStorage.setItem('user', 'parent');
    this.props.history.push({
            pathname: '/DeviceList',
            state: { user: 'parent' }
    })
    // setTimeout(
    //   () => {axios.get('/api/login').then(response => {
    //     this.props.userHasAuthenticated(true);
    //     sessionStorage.setItem('user', 'parent');
    //     this.props.history.push({
    //       pathname: '/DeviceList',
    //       state: { user: response.data.user }
    //     })
    //   }
    //   );
    // },0);
  }

  renderError() {
    const { passwordError } = this.state;

    if (passwordError) {
      return <div className="help-block">{passwordError}</div>;
    }

    return null;
  }
  errorClass(error){
    return(error.length === 0 ? '' : 'has-error');
  }

  render() {
    return <div className="container py-5 login-wrapper">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card rounded">
              <div className="card-header">
                <h3 className="mb-0">Login</h3>
              </div>
              <div className="card-body">
                <Form horizontal onSubmit={this.handleSubmit} >
                  <FormGroup controlId="email"
>
                    <Col componentClass={ControlLabel} sm={5}>
                      Username
                    </Col>
                    <Col sm={10}>
                      <FormControl autoFocus
                          type="email"
                          required
                          autoComplete="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          placeholder="username or email" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="password" className={`form-group ${this.errorClass(this.state.passwordError)}`}>
                    <Col componentClass={ControlLabel} sm={5}>
                      Password
                    </Col>
                    <Col sm={10}>
                      <FormControl value={this.state.password}
                          onChange={this.handleChange}
                          type="password"
                          required
                          value={this.state.password}
                          placeholder="password" />
                          {this.renderError()}
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <LoaderButton
                      block
                      bsSize="large"
                      className="btn-dark signIn-btn"
                      type="submit"
                      isLoading={this.state.isLoading}
                      text="Sign In"
                      loadingText="Logging in…"
                    />
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
