
import React, { Component } from 'react';
import ErrorMessage from './App.js';
import {Redirect} from 'react-router-dom';
import {token$} from './store.js';
import axios from 'axios';

class TodoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
      input: '',
      todos: [],
      errorMessage: '',
    };
    this.makeGetRequest = this.makeGetRequest.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmitAddTodo = this.onSubmitAddTodo.bind(this);
    this.onClickDeleteTodo = this.onClickDeleteTodo.bind(this);
  }

  componentDidMount() {
    //Listening to token-observable
    this.subscription = token$.subscribe((token) => {
      this.setState({token});
    });

    //Fetching todos from server
    this.makeGetRequest();
  }

  componentWillUnmount() {
    //Stop listening to token-observable
    this.subscription.unsubscribe();
  }

  makeGetRequest() {
    let token = this.state.token;

    axios.get('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000' + '/todos', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        let todos = response.data.todos;
        this.setState({todos: todos});
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

  onChange(event) {
    this.setState({input: event.target.value});
  }

  onSubmitAddTodo(event) {
    //Prevent form being sent
    event.preventDefault();

    //Fetching todo and token from state
    let todo = this.state.input;
    let token = this.state.token;

    //Post todo to API
    axios.post('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000' + '/todos', {content: todo}, { headers: { Authorization: `Bearer ${token}` } })
    .then(() => {
      //Then, make GET request
      axios.get('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000' + '/todos', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          let todos = response.data.todos;
          this.setState({todos: todos});

          //When the todos have arrived, clear input field
          this.setState({input:''});
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
    });
  }

  onClickDeleteTodo(event) {
    let id = event.target.id;
    let token = this.state.token;
    let todos = this.state.todos;

    //Deleting todo from server
    axios.delete('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000' + '/todos/' + id, { headers: { Authorization: `Bearer ${token}` } });

    //Deleting todo on client
    let updatedTodos = todos.filter(todo => todo.id !== id);
    this.setState({todos: updatedTodos});
  }

  render() {
    let token = this.state.token;
    let todos = this.state.todos;
    let errorMessage = this.state.errorMessage;

    //Creating list items out of todos
    let listItems = todos.map(todo => {
      return <ListItem todo={todo.content} key={todo.id} id={todo.id} onClickDeleteTodo={this.onClickDeleteTodo}/>;
    });

    //Redirecting to todo page if the user logs out
    if(token === null) {
      return <Redirect to="/"/>;
    }

    return(
        <main>
          <form onSubmit={this.onSubmitAddTodo}>
            <input type="text" onChange={this.onChange} value={this.state.input} required/>
            <button type="submit">Add todo</button>
          </form>
          {errorMessage ? <ErrorMessage.ErrorMessage content={errorMessage}/> : null}
          <div className="todos">
            <h2>Todo</h2>
            <ul>{listItems}</ul>
          </div>
        </main>
    );
  }
}

// Component: List item
// I installed material icons, but I couldn't make it work without the link. Shouldn't it work without the link?
class ListItem extends Component {
  render() {
    return(
      <li>
        {this.props.todo}
        <button className="delete-button" id={this.props.id} onClick={this.props.onClickDeleteTodo}>
          <i className="material-icons" id={this.props.id}>close</i>
        </button>
      </li>
    );
  }
}

export default TodoPage;
