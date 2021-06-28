import React from "react";
import { useHistory } from "react-router-dom";
import { firebaseApp } from "../firebase";

const ChatList = () => {
	const history = useHistory();
	const logOut = () => {
		firebaseApp.auth().signOut();
		alert("로그아웃 되었습니다.");
		history.push("/");
	};
	return (
		<div>
			<h1>Chat List</h1>
			<button onClick={logOut}>Logout</button>
		</div>
	);
};

export default ChatList;
