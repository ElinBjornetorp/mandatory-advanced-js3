
import React, { Component } from 'react';
import RegisterButton from './App.js';
import LoginButton from './App.js';
import LogoutButton from './App.js';
import ErrorMessage from './App.js';
import API_ROOT from './App.js';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {token$, updateToken} from './store.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
      email: '',
      password: '',
      errorMessage: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
  }

  componentDidMount() {
    //Listening to token-observable
    this.subscription = token$.subscribe((token) => {
      this.setState({token});
    });
  }

  componentWillUnmount() {
    //Stop listening to token-observable
    this.subscription.unsubscribe();
  }

  // Dynamic function to update the state corresponding to the input field :)
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmitLogin(event) {
    let email = this.state.email;
    let password = this.state.password;

    //Preventing form being sent
    event.preventDefault();

    //Making login request
    axios.post(API_ROOT.API_ROOT + '/auth', {email, password})
    // Then, updating token
    .then((response) => {
      let token = response.data.token;
      updateToken(token);
    })
    .catch((error) => {
      if(error.response) {
        console.log(error.response);
        this.setState({errorMessage: error.response.data.message});
      }
      else {
        console.log(error);
        this.setState({errorMessage: 'Something went wrong.'});
      }
    });
  }

  render() {
    let token = this.state.token;
    let errorMessage = this.state.errorMessage;

    if(token) {
      return <Redirect to="/todos"/>;
    }
    else {
      return(
        <>
          <form onSubmit={this.onSubmitLogin}>
            <h2>Login</h2>
            E-mail: <input type="email" name="email" onChange={this.onChange}/> <br/>
            Password: <input type="password" name="password" onChange={this.onChange}/> <br/>
            {errorMessage ? <ErrorMessage.ErrorMessage content={errorMessage}/> : null}
            <button type="submit">Login</button>
          </form>
        </>
      );
    }
  }
}

export default LoginPage;
