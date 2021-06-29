import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
					<Route exact path="/chat/list" component={ChatList} />
					<Route exact path="/users/signUp" component={SignUp} />
					<Route exact path="/chat/room/:roomId" component={ChatRoom} />
				</Switch>
			</Router>
		);
	}
}
export default Routes;
