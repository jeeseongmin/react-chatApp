import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, firebaseApp } from "../firebase";
import { Button, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Chat from "../components/Chat";

const ChatRoom = () => {
	const uid = useSelector((state) => state.user.uuid);
	const chatBox = useRef(null);
	const history = useHistory();
	const { roomId } = useParams();
	const _roomId = "room_" + roomId;
	const [roomInfo, setRoomInfo] = useState({});

	const [text, setText] = useState("");
	// 현재 room의 모든 chatting
	const [chats, setChats] = useState([]);
	const [modifyCandidate, setModifyCandidate] = useState(null);
	const [newCandidate, setNewCandidate] = useState(null);

	// 맨 처음에 정보들 받아올 때.
	useEffect(() => {
		db.collection("chatrooms")
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

	const goBack = () => {
		history.goBack();
	};

	const scrollToBottom = () => {
		// console.log('box: ', box);
		const { scrollHeight, clientHeight, scrollTop } = chatBox.current;
		chatBox.current.scrollTop = scrollHeight - clientHeight;
	};
	/* 
		message를 보내면, chats 이라는 collection에 추가하고, 
		_roomId를 가지는 chatrooms의 message에도 추가한다.
	
	*/

	const sendMessage = () => {
		console.log("send message");
		const payload = {
			uidOfUser: uid,
			content: text,
			uid: uuidv4(),
			created: firebase.firestore.Timestamp.now().seconds,
		};
		/* 
			예제에서는 이 부분이 없어서 생각해보다가 
			각 chatroom에 messages라는 collection을 만드는 것이 맞다고 생각했다.
		*/
		db.collection("chatrooms")
			.doc(_roomId)
			.collection("messages")
			.add(payload)
			.then((ref) => {
				setText("");
				const cp = [...chats];
				cp.push(payload);
				setChats(cp);
				scrollToBottom();
			});
	};

	useEffect(() => {
		const cp = [...chats];
		cp.push(newCandidate);
		setChats(cp);
		// scrollToBottom();
	}, [newCandidate]);

	useEffect(() => {
		// 초기화를 해줘야 쌓이지 않는다.
		// setChats([]);
		const chatRef = db
			.collection("chatrooms")
			.doc(_roomId)
			.collection("messages");
		chatRef
			.orderBy("created")
			.get()
			.then((snapshot) => {
				// 이렇게 특정 change type으로 나누는 이유가 무엇일까?
				snapshot.docChanges().forEach((change) => {
					// 새로운 data일 때
					if (change.type === "added") {
						const newEntry = change.doc.data();
						newEntry.id = change.doc.id;
						setNewCandidate(newEntry);
						console.log("added!");
					}
					// 수정된 data일 때
					if (change.type === "modified") {
						const data = change.doc.data();
						data.id = change.doc.id;
						setModifyCandidate(data);
					}
					// 제거된 data일 때
					if (change.type === "removed") {
						console.log("remove message: ", change.doc.data());
					}
					scrollToBottom();
				});
			});
	}, []);

	// input은 n개의 url api
	// ouput은 api 하나당 데이터가 접근 가능한 상태. state

	// useEffect(() => {
	// 	const cp = [...chats];
	// 	const index = cp.findIndex((el) => el.uid === modifyCandidate.uid);
	// 	cp[index] = modifyCandidate;
	// 	setChats(cp);
	// }, [modifyCandidate]);

	// useEffect(() => {
	// 	const chatRef = db
	// 		.collection("chatrooms")
	// 		.doc(_roomId)
	// 		.collection("messages");
	// 	chatRef.orderBy("created").onSnapshot((snapshot) => {
	// 		snapshot.docChanges().forEach((change) => {
	// 			if (change.type === "added") {
	// 				const newEntry = change.doc.data();
	// 				newEntry.id = change.doc.id;
	// 				setModifyCandidate(newEntry);
	// 			}
	// 			if (change.type === "modified") {
	// 				const data = change.doc.data();
	// 				data.id = change.doc.id;
	// 				setModifyCandidate(data);
	// 			}
	// 			if (change.type === "removed") {
	// 				console.log("remove message: ", change.doc.data());
	// 			}
	// 		});
	// 	});
	// }, []);

	// useEffect(() => {
	// 	const messageRef = db
	// 		.collection("chatrooms")
	// 		.doc(_roomId)
	// 		.collection("messages");

	// 	messageRef
	// 		.orderBy("created")
	// 		.get()
	// 		.then((snapshot) => {
	// 			const data = snapshot.docs.map((doc) => ({
	// 				id: doc.id,
	// 				...doc.data(),
	// 			}));
	// 			setChats(data);
	// 			console.log(data);
	// 		});
	// }, []);

	// const chatHistory = chats.map((chat, index) => {
	// 	console.log("haha");
	// 	if (index !== 0) {
	// 		if (chat.uidOfUser === uid) {
	// 			return (
	// 				<div className="chatBox myChat">
	// 					<div className="">{chat.content}</div>
	// 				</div>
	// 			);
	// 		} else if (chat.uidOfUser !== uid) {
	// 			return (
	// 				<div className="chatBox otherChat">
	// 					<div className=""></div>
	// 					<div className="">{chat.content}</div>
	// 				</div>
	// 			);
	// 		}
	// 	}
	// });

	return (
		<div className="chatRoomWrapper">
			<h1>
				{roomInfo.title} <Badge variant="primary">{roomInfo.roomId}</Badge>
			</h1>
			<h3>호스트 : {roomInfo.host}</h3>
			<div className="chat-area" ref={chatBox}>
				{/* {chatHistory} */}
				{chats.map((chat, index) => {
					if (index !== 0) {
						return <Chat chat={chat} key={chat.uid} uid={uid} />;
					}
				})}
			</div>
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
