import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChatRoomMain from "./pages/ChatRoomMain";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ChatMain from "./pages/ChatMain";

class Routes extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/chat/main" component={ChatMain} />
					<Route exact path="/users/signUp" component={SignUp} />
					<Route exact path="/chat/room/:rid" component={ChatRoomMain} />
				</Switch>
			</Router>
		);
	}
}
export default Routes;
