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

const ChatMain = () => {
	const email = useSelector((state) => state.user.email);
	const uid = useSelector((state) => state.user.uid);

	const history = useHistory();
	const [chatrooms, setChatrooms] = useState([]);
	const [inputValue, setInputValue] = useState({
		roomId: "",
		title: "",
		password: "",
	});

	const onInfoChange = (e, key) => {
		const cp = { ...inputValue };
		cp[key] = e.target.value;
		setInputValue(cp);
	};
	useEffect(() => {
		console.log("upload");
		db.collection("chatrooms")
			.get()
			.then((querySnapshot) => {
				setChatrooms(querySnapshot.docs.map((doc) => doc.data()));
			});
	}, []);

	const logOut = () => {
		firebaseApp.auth().signOut();
		alert("로그아웃 되었습니다.");
		history.push("/");
	};

	// 새로운 room을 생성한다.
	const addRoom = (e) => {
		e.preventDefault();
		const { title, password } = e.target.elements;
		if (title.value && password.value) {
			const rid = uuidv4();
			db.collection("chatrooms")
				.doc(rid)
				.get()
				.then((doc) => {
					if (doc.data()) {
						alert("해당 번호로 등록된 채팅방이 있습니다.");
					} else {
						const payload = {
							title: title.value,
							password: password.value,
							id: rid,
							// room 만든 사람
							uidOfUser: uid,
							// 그냥 편의로 만든 host.
							host: email,
							messages: {},
						};
						// 해당 id의 방이 없으므로 생성
						db.collection("chatrooms")
							.doc(rid)
							.set({
								title: payload.title,
								password: payload.password,
								id: payload.id,
								uidOfUser: uid,
								host: payload.host,
								messages: {},
							})
							.then((e) => {
								const cp = [...chatrooms];
								cp.push(payload);
								setChatrooms(cp);
								console.log("Document successfully written!");
								alert("방이 생성되었습니다!");
								setInputValue({
									title: "",
									password: "",
								});
							})
							.catch((error) => {
								console.error("Error writing document: ", error);
							});
					}
				})
				.catch((error) => {
					alert("데이터베이스 오류");
				});
		} else {
			alert("미입력된 항목이 있습니다.");
		}
	};

	return (
		<div className="chatListWrapper">
			<div className="logoutWrapper">
				<Button variant="secondary" onClick={logOut}>
					Logout
				</Button>
			</div>
			<div className="chatListHeader">
				<h1>Chat Chat Chat</h1>
				<h4>{email}님 환영합니다.</h4>
			</div>

			<div>
				<form onSubmit={addRoom} className="formWrapper">
					<div>채팅방 새로 만들기 - </div>
					{/* <div>
						<label>RoomId : </label>
						<input
							value={inputValue.roomId}
							type="text"
							name="roomId"
							onChange={(e) => onInfoChange(e, "roomId")}
							placeholder="roomId"
						/>
					</div> */}
					<div>
						<label>title : </label>
						<input
							value={inputValue.title}
							type="text"
							name="title"
							onChange={(e) => onInfoChange(e, "title")}
							placeholder="title"
						/>
					</div>
					<div>
						<label>password : </label>
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
							add Room
						</Button>
					</div>
				</form>
			</div>
			<div className="chatroomWrapper">
				{chatrooms.map((chatroom, index) => {
					return <ChatRoom chatroom={chatroom} index={index} />;
				})}
			</div>
		</div>
	);
};

export default ChatMain;
