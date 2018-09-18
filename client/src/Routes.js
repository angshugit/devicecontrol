import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import DeviceList from "./containers/DeviceList";

// export default () =>
//   <Switch>
//     <Route path="/" exact component={Home} />
//     <Route path="/login" exact component={Login} />
//     <Route component={NotFound} />
//   </Switch>;


export default ({ childProps }) =>
<Switch>
  <AppliedRoute path="/" exact component={Home} props={childProps} />
  <AppliedRoute path="/login" exact component={Login} props={childProps} />
  <AppliedRoute path="/deviceList" exact component={DeviceList} props={childProps} />

  { /* Finally, catch all unmatched routes */ }
  <Route component={NotFound} />
</Switch>;