import React, { Component } from 'react';
import axios from 'axios';
class App extends Component {
  componentDidMount() {
    const api = 'https://53za4egyyc.execute-api.us-east-2.amazonaws.com/undefined/';
    const data = { "name" : "Mike" };
    axios
      .post(api, data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  render() {
    return (
      <div>Medium Tutorial</div>
    );
  }
}
export default App;
