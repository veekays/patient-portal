import React, { Component } from 'react';
import Home from "./components/home"
import PatientProfile from './components/singlePatient'
import {Route} from 'react-router-dom'

export default class App extends Component {
  
  render() {
    return (
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/patient/:id" component={PatientProfile}/>
      </div>
    )
  }

}