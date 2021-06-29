import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, firebaseApp } from "../firebase";
import { Button, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const ChatRoom = () => {
	const uid = useSelector((state) => state.user.uuid);
	const { roomId } = useParams();
	const _roomId = "room_" + roomId;
	const [roomInfo, setRoomInfo] = useState({});
	const [chats, setChats] = useState({});
	const [text, setText] = useState("");
	const [modifyCandidate, setModifyCandidate] = useState(null);
	const [newCandidate, setNewCandidate] = useState(null);

	useEffect(() => {
		const cp = [...chats];
		cp.push(modifyCandidate);
		setChats(cp);
	}, [newCandidate]);
	const history = useHistory();

	const goBack = () => {
		history.goBack();
	};

	const sendMessage = () => {
		const payload = {
			uidOfUser: uid,
			content: text,
			uid: uuidv4(),
			created: firebase.firestore.Timestamp.now().seconds,
		};

		db.collection("chats")
			.add(payload)
			.then((ref) => {
				console.log(ref);
				setText("");
			});
	};

	useEffect(() => {
		const chatRef = db
			.collection("chatrooms")
			.doc(_roomId)
			.collection("messages");
		chatRef.orderBy("created").onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === "added") {
					const newEntry = change.doc.data();
					newEntry.id = change.doc.id;
					setModifyCandidate(newEntry);
				}
				if (change.type === "modified") {
					const data = change.doc.data();
					data.id = change.doc.id;
					setModifyCandidate(data);
				}
				if (change.type === "removed") {
					console.log("remove message: ", changed.doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		const chatroomsRef = db
			.collection("chatrooms")
			.doc(_roomId)
			.get()
			.then((doc) => {
				if (doc.data()) {
					const hostEmail = doc
						.data()
						.host.slice(0, doc.data().host.indexOf("@"));

					setRoomInfo({
						roomId: doc.data().roomId,
						title: doc.data().title,
						password: doc.data().password,
						id: doc.data().id,
						host: hostEmail,
					});
				} else {
					alert("없습니다.");
				}
			})
			.catch((error) => {
				alert("데이터베이스 오류");
			});
	}, []);

	useEffect(() => {
		const messageRef = db
			.collection("chatrooms")
			.doc(_roomId)
			.collection("messages");

		messageRef
			.orderBy("created")
			.get()
			.then((snapshot) => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setChats(data);
				console.log(data);
			});
	}, []);

	//...
	return (
		<div className="chatRoomWrapper">
			<h1>
				{roomInfo.title} <Badge variant="primary">{roomInfo.roomId}</Badge>
			</h1>
			<h3>호스트 : {roomInfo.host}</h3>
			<div className="chat-area"></div>
			<div className="sendMessageWrapper">
				<input
					type="text"
					className="inputMessage"
					placeholder="대화창입니다."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<Button variant="success" className="sendBtn" onClick={sendMessage}>
					전송
				</Button>
			</div>
			<Button variant="secondary" onClick={goBack}>
				뒤로가기
			</Button>
		</div>
	);
};

export default ChatRoom;
