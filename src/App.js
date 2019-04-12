import React, {Component} from 'react';
import './App.css';
import RegistrationPage from './RegistrationPage.js';
import LoginPage from './LoginPage.js';
import TodoPage from './TodoPage.js';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {token$, updateToken} from './store.js';
import jwt from 'jsonwebtoken';

const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
    };
    this.onClickLogout = this.onClickLogout.bind(this);
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

  onClickLogout(event) {
    updateToken(null);
  }

  render() {
    let token = this.state.token;
    let email = null;

    //Decoding email if the user is logged in
    if(token) {
      const decoded = jwt.decode(token);
      email = decoded.email;
    }

    return (
      <Router>
        <header>
          <h1>TodoApp</h1>
          <nav>
            {email ? <p>{email} is logged in.</p> : null}
            <RegisterButton/>
            {email ? <LogoutButton onClick={this.onClickLogout}/> : <LoginButton/>}
          </nav>
        </header>
        {}
        <Route exact path="/" component={LoginPage}/>
        <Route path="/register" component={RegistrationPage}/>
        <Route path="/todos" component={TodoPage}/>
      </Router>
    );
  }
}

// Function component: Register button
const RegisterButton = () => {
  return(
    <button>
      <Link to="/register">Register</Link>
    </button>
  );
}

// Function component: Login button
const LoginButton = () => {
  return(
    <button>
      <Link to="/">Login</Link>
    </button>
  );
}

// Component: Logout button
class LogoutButton extends Component {
  render() {
    return <button onClick={this.props.onClick}>Logout</button>;
  }
}

// Component: Error message
class ErrorMessage extends Component {
  render() {
    return <p>{this.props.content}</p>;
  }
}

export default {
  App: App,
  RegisterButton: RegisterButton,
  LoginButton: LoginButton,
  LogoutButton: LogoutButton,
  ErrorMessage: ErrorMessage,
  API_ROOT: API_ROOT,
};
