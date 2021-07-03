import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db, firebase, firebaseApp } from "../firebase";
import { Button, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Chat from "../components/Chat";
import InviteModal from "../components/InviteModal";
import EditRoomModal from "../components/EditRoomModal";

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
	const [hostName, setHostName] = useState();
	// const [peopleList, setPeopleList] = useState([]);

	const [modalShow, setModalShow] = useState(false);

	const [editModalShow, setEditModalShow] = useState(false);

	const [isChanged, setIsChanged] = useState(false);

	// useEffect(() => {
	// 	const getChats = async function () {
	// 		const querySnapshot = await db
	// 			.collection("chatrooms")
	// 			.doc(rid)
	// 			.collection("messages")
	// 			.get();
	// 		console.log("docdoc");
	// 		const cp = querySnapshot.docs.map((doc) => {
	// 			var obj = doc.data();
	// 			obj["docId"] = doc.id;
	// 			return obj;
	// 		});
	// 		setChats(cp);
	// 	};
	// 	getChats();
	// }, []);

	// 맨 처음에 정보들 받아올 때.
	useEffect(() => {
		let init = async function (req, res) {
			try {
				const doc = await db.collection("chatrooms").doc(rid).get();
				if (doc.data()) {
					setRoomInfo({
						title: doc.data().title,
						password: doc.data().password,
						id: doc.data().id,
						// 만든 사람
						uidOfUser: doc.data().uidOfUser,
						host: doc.data().host,
					});
				} else {
					alert("방을 찾을 수 없습니다.");
				}
			} catch (error) {
				console.log(error);
				alert("데이터베이스 오류");
			}
		};
		init();
	}, [modalShow, editModalShow]);

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
		/* 
			예제에서는 이 부분이 없어서 생각해보다가 
			각 chatroom에 messages라는 collection을 만드는 것이 맞다고 생각했다.
		*/
		if (text === "") {
			alert("메시지를 입력하세요");
			return;
		}
		const payload = {
			uidOfUser: uid,
			content: text,
			id: uuidv4(),
			created: firebase.firestore.Timestamp.now().seconds,
			like: [],
		};
		const doc = await db
			.collection("chatrooms")
			.doc(rid)
			.collection("messages")
			.add(payload);
		// message 창 초기화
		payload.docId = doc.id;
		const cp = [...chats];
		cp.push(payload);
		setChats(cp);
		setText("");
		scrollToBottom();
		setIsChanged(!isChanged);
	};

	useEffect(() => {
		const cp = [...chats];
		cp.push(newCandidate);
		setChats(cp);
		// scrollToBottom();
	}, [newCandidate]);

	const deleteChat = async (chat) => {
		if (uid === chat.uidOfUser || uid === roomInfo.uidOfUser) {
			const deleteId = chat.id;
			const cp = chats.filter(function (element, index) {
				if (index !== 0) {
					return element.id !== deleteId;
				} else return true;
			});
			setChats(cp);
			try {
				// alert(rid + " 성공적! " + chat.docId);
				await db
					.collection("chatrooms")
					.doc(rid)
					.collection("messages")
					.doc(chat.docId)
					.delete();
				setIsChanged(!isChanged);
			} catch (error) {
				console.log(error);
				alert("에러!");
			}
		} else {
			alert("권한이 없습니다.");
			return 0;
		}
	};

	// 내용 변경
	const editChat = async (chat) => {
		console.log(chat);
		alert("haha");
	};

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
					newEntry.docId = change.doc.id;
					setNewCandidate(newEntry);
					console.log("added!");
				}
				// 수정된 data일 때
				if (change.type === "modified") {
					const data = change.doc.data();
					data.docId = change.doc.id;
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
	}, [isChanged]);

	return (
		<div className="chatRoomMainWrapper">
			<EditRoomModal
				show={editModalShow}
				onHide={() => setEditModalShow(false)}
				uid={uid}
				roominfo={roomInfo}
				key={roomInfo.id}
			/>
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
			{uid === roomInfo.uidOfUser && (
				<div className="inviteWrapper">
					<Button
						variant="warning"
						onClick={() => setEditModalShow(true)}
						className="editBtn"
					>
						수정
					</Button>
					<Button
						variant="success"
						className="inviteBtn"
						onClick={() => setModalShow(true)}
					>
						+ 초대
					</Button>
				</div>
			)}
			<h1>
				{roomInfo.title} <Badge variant="primary">On</Badge>
			</h1>
			<h3>호스트 : {roomInfo.host}</h3>
			<div className="chat-area" ref={chatBox}>
				{/* {chatHistory} */}
				{chats.map((chat, index) => {
					console.log(chats);
					if (index !== 0) {
						return (
							<Chat
								chat={chat}
								key={index}
								uid={uid}
								rid={rid}
								hostId={roomInfo.uidOfUser}
								deleteChat={deleteChat}
								chats={chats}
							/>
						);
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
