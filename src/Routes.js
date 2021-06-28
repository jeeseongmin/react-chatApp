import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ChatList from "./pages/ChatList";

class Routes extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/users/login" component={Login} />
					<Route exact path="/chatList" component={ChatList} />
					<Route exact path="/users/signUp" component={SignUp} />
					<Route exact path="/chatRoom/:roomId" component={ChatRoom} />
				</Switch>
			</Router>
		);
	}
}
export default Routes;
