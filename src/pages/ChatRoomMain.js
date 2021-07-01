import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, firebaseApp } from "../firebase";
import { Button, Card, Badge, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Chat from "../components/Chat";
import InviteModal from "../components/InviteModal";

const ChatRoomMain = () => {
	const uid = useSelector((state) => state.user.uid);
	const chatBox = useRef(null);
	const history = useHistory();
	const { rid } = useParams();
	// const _roomId = "room_" + roomId;
	const [roomInfo, setRoomInfo] = useState({});

	const [text, setText] = useState("");
	// 현재 room의 모든 chatting
	const [chats, setChats] = useState([]);
	const [modifyCandidate, setModifyCandidate] = useState(null);
	const [newCandidate, setNewCandidate] = useState(null);
	// const [peopleList, setPeopleList] = useState([]);

	const [modalShow, setModalShow] = useState(false);

	// 맨 처음에 정보들 받아올 때.
	useEffect(() => {
		let init = async function (req, res) {
			try {
				const doc = await db.collection("chatrooms").doc(rid).get();
				if (doc.data()) {
					const hostEmail = doc
						.data()
						.host.slice(0, doc.data().host.indexOf("@"));
					// 해당 방의 정보 임시저장.
					setRoomInfo({
						title: doc.data().title,
						password: doc.data().password,
						id: doc.data().id,
						// 만든 사람
						uidOfUser: doc.data().uidOfUser,
						host: hostEmail,
					});
				} else {
					alert("방을 찾을 수 없습니다.");
				}
			} catch (error) {
				alert("데이터베이스 오류");
			}
		};
		init();
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

	// 메시지를 보내는 함수.
	const sendMessage = async () => {
		const payload = {
			uidOfUser: uid,
			content: text,
			id: uuidv4(),
			created: firebase.firestore.Timestamp.now().seconds,
		};
		/* 
			예제에서는 이 부분이 없어서 생각해보다가 
			각 chatroom에 messages라는 collection을 만드는 것이 맞다고 생각했다.
		*/
		await db
			.collection("chatrooms")
			.doc(rid)
			.collection("messages")
			.add(payload);
		// message 창 초기화
		setText("");
		const cp = [...chats];
		cp.push(payload);
		setChats(cp);
		scrollToBottom();
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
		let onChange = async function () {
			const snapshot = await db
				.collection("chatrooms")
				.doc(rid)
				.collection("messages")
				.orderBy("created")
				.get();
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
				// scrollToBottom();
			});
		};

		onChange();
	}, []);

	return (
		<div className="chatRoomMainWrapper">
			<InviteModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				uid={uid}
				rid={rid}
			/>
			<div className="backWrapper">
				<Button variant="secondary" onClick={goBack}>
					Back
				</Button>
			</div>
			<div className="inviteWrapper">
				{uid === roomInfo.uidOfUser && (
					<Button
						variant="success"
						className="inviteBtn"
						onClick={() => setModalShow(true)}
					>
						+ 초대
					</Button>
				)}
			</div>
			<h1>
				{roomInfo.title} <Badge variant="primary">On</Badge>
			</h1>
			<h3>호스트 : {roomInfo.host}</h3>
			<div className="chat-area" ref={chatBox}>
				{/* {chatHistory} */}
				{chats.map((chat, index) => {
					if (index !== 0) {
						return <Chat chat={chat} key={chat.id} uid={uid} />;
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
		</div>
	);
};

export default ChatRoomMain;
