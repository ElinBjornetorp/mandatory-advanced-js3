
import React, { Component } from 'react';
import ErrorMessage from './App.js';
import API_ROOT from './App.js';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {updateToken} from './store.js';

class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      goToTodos: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitRegister = this.onSubmitRegister.bind(this);
  }

  // Dynamic function to update the state corresponding to the input field :)
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmitRegister(event) {
    let email = this.state.email;
    let password = this.state.password;

    //Preventing form being sent
    event.preventDefault();

    //Making registration request
    axios.post(API_ROOT.API_ROOT + '/register', {email, password})
    .then((response) => {
      //Removing error message if there was one
      this.setState({errorMessage: ''});

      //Making login request
      axios.post(API_ROOT.API_ROOT + '/auth', {email, password})
      // Then, updating token and redirecting to todo page
      .then((response) => {
        let token = response.data.token;
        updateToken(token);
        this.setState({goToTodos: true});
      })
      .catch((error) => {
        if(error.response) {
          this.setState({errorMessage: error.response.data.message});
        }
        else {
          this.setState({errorMessage: 'Something went wrong.'});
        }
      });
    })
    .catch((error) => {
      if(error.response) {
        this.setState({errorMessage: error.response.data.message});
      }
      else {
        this.setState({errorMessage: 'Something went wrong.'});
      }
    });
  }

  render() {
    let goToTodos = this.state.goToTodos;
    let errorMessage = this.state.errorMessage;

    if(goToTodos) {
      return <Redirect to="/todos"/>;
    }
    else {
      return(
        <>
          <form onSubmit={this.onSubmitRegister}>
            <h2>Register a new user</h2>
            Enter your e-mail: <input type="email" name="email" onChange={this.onChange} required/> <br/>
            Enter your password: <input type="password" name="password" onChange={this.onChange} required/> <br/>
            {errorMessage ? <ErrorMessage.ErrorMessage content={errorMessage}/> : null}
            <button type="submit">Register and login</button>
          </form>
        </>
      );
    }
  }
}

export default RegistrationPage;
