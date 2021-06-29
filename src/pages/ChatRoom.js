import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, firebaseApp } from "../firebase";
const ChatRoom = () => {
	const { roomId } = useParams();

	useEffect(() => {
		const _roomId = "room_" + roomId;
		const current = db
			.collection("chatrooms")
			.doc(_roomId)
			.get()
			.then((doc) => {
				console.log(doc.data());
				if (doc.data()) {
					alert("있습니다");
				} else {
					alert("없습니다.");
				}
			})
			.catch((error) => {
				alert("데이터베이스 오류");
			});
	}, []);
	const history = useHistory();
	//...
	return (
		<div>
			<h1>{roomId}</h1>
			<h1>해당 Room 번호는 : {roomId} 입니다.</h1>
		</div>
	);
};

export default ChatRoom;
