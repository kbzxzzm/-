import React from "react";
import Map from "./pages/Map";
// import { Button } from "antd-mobile";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Home from "./pages/Home";
import Citylist from "./pages/Citylist";
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/"
            render={props => {
              return <Redirect to="/home/index"></Redirect>;
            }}
          />
          <Route path="/home" component={Home}></Route>
          <Route exact path="/citylist" component={Citylist}></Route>
          <Route exact path="/map" component={Map}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
