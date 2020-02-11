import React,  { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import Router from './Router';
import reducers from './reducers';

export default class App extends Component {
  componentDidMount() {
    StatusBar.setHidden(true);
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}