import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";
import ChatRoom from "../components/ChatRoom";
import MyInvitationModal from "../components/MyInvitationModal";

const ChatMain = () => {
	const email = useSelector((state) => state.user.email);
	const uid = useSelector((state) => state.user.uid);

	const history = useHistory();
	//
	const [chatrooms, setChatrooms] = useState([]);
	const [inputValue, setInputValue] = useState({
		roomId: "",
		title: "",
		password: "",
	});
	const [payload, setPayload] = useState({});
	const [modalShow, setModalShow] = useState(false);

	// 로그인 한 유저가 aceept 되어있는 목록

	const onInfoChange = (e, key) => {
		const cp = { ...inputValue };
		cp[key] = e.target.value;
		setInputValue(cp);
	};

	useEffect(() => {
		const setting = async function (req, res) {
			let querySnapshot = await db.collection("chatrooms").get();
			setChatrooms(querySnapshot.docs.map((doc) => doc.data()));
		};
		setting();
	}, []);

	const logOut = () => {
		firebaseApp.auth().signOut();
		alert("로그아웃 되었습니다.");
		history.push("/");
	};

	const addRooms = async (payload) => {
		console.log("addRooms");
		console.log(payload);
		setPayload(payload);
		try {
			await db.collection("chatrooms").doc(payload.id).set({
				title: payload.title,
				password: payload.password,
				id: payload.id,
				uidOfUser: uid,
				host: payload.host,
				messages: {},
			});
			const cp = [...chatrooms];
			cp.push(payload);
			setChatrooms(cp);
			console.log("Document successfully written!");
			alert("방이 생성되었습니다!");

			setInputValue({
				title: "",
				password: "",
			});
		} catch (error) {
			console.error("Error writing document: ", error);
		}
	};

	// 새로운 room을 생성한다.
	const checkRooms = async (e) => {
		e.preventDefault();
		const { title, password } = e.target.elements;
		if (title.value) {
			const rid = uuidv4();
			try {
				const doc = await db.collection("chatrooms").doc(rid).get();
				if (doc.data()) {
					alert("해당 번호로 등록된 채팅방이 있습니다.");
				} else {
					const _payload = {
						title: title.value,
						password: password.value,
						id: rid,
						// room 만든 사람
						uidOfUser: uid,
						// 그냥 편의로 만든 host.
						host: email,
						messages: {},
					};
					// setPayload(_payload);
					// 해당 id의 방이 없으므로 생성
					addRooms(_payload);
				}
			} catch (error) {
				alert("오류 발생");
			}
		}
	};

	const enterChatRoom = async (chatroomInfo, acceptRooms) => {
		const roomPasword = chatroomInfo.password;
		// 패스워드를 입력했거나, 내가 초대된 방이면
		console.log(acceptRooms);
		if (acceptRooms) {
			history.push("/chat/room/" + chatroomInfo.id);
		} else if (email !== chatroomInfo.host) {
			const answer = prompt("방의 비밀번호를 입력해주세요.");
			if (answer === roomPasword) {
				history.push("/chat/room/" + chatroomInfo.id);
			} else {
				alert("비밀번호가 틀렸습니다.");
			}
		} else {
			history.push("/chat/room/" + chatroomInfo.id);
		}
	};

	const deleteRoom = async (e) => {
		const deleteId = e.target.value;
		const doc = await db.collection("chatrooms").doc(deleteId).get();
		const deletePassword = doc.data().password;
		if (email === doc.data().host) {
			console.log(deletePassword);
			const answer = prompt("비밀번호를 입력해주세요.");
			if (answer === deletePassword) {
				db.collection("chatrooms").doc(deleteId).delete();
				alert("삭제되었습니다.");

				const cp = chatrooms.filter(function (element) {
					return element.id !== deleteId;
				});
				setChatrooms(cp);
			} else {
				alert("비밀번호가 틀렸습니다.");
			}
		} else {
			alert("작성자만 삭제할 수 있습니다.");
		}
	};

	return (
		<div className="chatListWrapper">
			<MyInvitationModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				uid={uid}
			/>
			<div className="logoutWrapper">
				<Button
					variant="success"
					className="inviteBtn"
					onClick={() => setModalShow(true)}
				>
					내 알림
				</Button>
				<Button variant="secondary" onClick={logOut}>
					로그아웃
				</Button>
			</div>
			<div className="chatListHeader">
				<h1>Chat Chat Chat</h1>
				<h4>{email.slice(0, email.indexOf("@"))}님 환영합니다.</h4>
			</div>

			<div>
				<form onSubmit={checkRooms} className="formWrapper">
					<div>
						<div>
							<h4>
								<b>채팅방 새로 만들기 : </b>
							</h4>
						</div>
						<div>
							<input
								value={inputValue.title}
								type="text"
								name="title"
								className="inputBox"
								onChange={(e) => onInfoChange(e, "title")}
								placeholder="title"
							/>
						</div>
						<div>
							<input
								value={inputValue.password}
								type="password"
								name="password"
								onChange={(e) => onInfoChange(e, "password")}
								placeholder="password"
							/>
						</div>
						<div>
							<Button variant="success" type="submit">
								추가
							</Button>
						</div>
					</div>
				</form>
			</div>
			<div className="chatroomWrapper">
				{chatrooms.map((chatroom, index) => {
					// 허락되지 않은 room들
					return (
						<ChatRoom
							chatroom={chatroom}
							index={index}
							key={index}
							uid={uid}
							deleteOne={deleteRoom}
							enterRoom={enterChatRoom}
						/>
					);
					// 허락된 room들
				})}
			</div>
		</div>
	);
};

export default ChatMain;
