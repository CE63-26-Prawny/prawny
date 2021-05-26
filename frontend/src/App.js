// export default App;
import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Graph from "./pages/virtualize/graph_virtualize";
import ConfigNoti from "./pages/configNoti/configNoti";
import AddDevice from "./pages/AddDevice/AddDevice";
import Calibrate from "./pages/Calibrate/Calibrate";
const App = () => (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route path="/home" component={Home} />
    <Route path="/graph" component={Graph} />
    <Route path="/confignoti" component={ConfigNoti} />
    <Route path="/AddDevice" component ={AddDevice} />
    <Route path="/Calibrate" component ={Calibrate} />
  </Switch>
);

export default App;
