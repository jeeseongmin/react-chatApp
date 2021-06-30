import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";
import { useSelector } from "react-redux";

const ChatList = () => {
	const email = useSelector((state) => state.user.email);
	const [chatrooms, setChatrooms] = useState([]);
	const [inputValue, setInputValue] = useState({
		roomId: "",
		title: "",
		password: "",
	});

	const enterChatRoom = (chatroom) => {
		history.push("/chat/room/" + chatroom.roomId);
	};

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

	const deleteRoom = (e) => {
		const deleteId = e.target.value;
		db.collection("chatrooms")
			.doc("room_" + deleteId)
			.get()
			.then((doc) => {
				const deletePassword = doc.data().password;
				if (email === doc.data().host) {
					console.log(deletePassword);
					const answer = prompt("비밀번호를 입력해주세요.");
					if (answer === deletePassword) {
						db.collection("chatrooms")
							.doc("room_" + deleteId)
							.delete();
						alert("삭제되었습니다.");
					} else {
						alert("비밀번호가 틀렸습니다.");
					}
				} else {
					alert("작성자만 삭제할 수 있습니다.");
				}
			});
	};
	function loadList(props) {
		console.log("rendering components");
		console.log(props);
		return (
			<div>
				<h1>haha</h1>
			</div>
		);
	}

	const ChattingList = chatrooms.map((chatroom, index) => (
		<Card style={{ width: "18rem" }} className="cardComponent">
			<Card.Body>
				<Card.Title>
					{chatroom.host.slice(0, chatroom.host.indexOf("@"))}님의 <br></br>
					{chatroom.title}
				</Card.Title>
				<div className="buttonWrapper">
					<Button
						variant="primary"
						onClick={(e) => {
							enterChatRoom(chatroom);
						}}
						key={index}
					>
						입장
					</Button>
					<Button variant="danger" value={chatroom.roomId} onClick={deleteRoom}>
						삭제
					</Button>
				</div>
			</Card.Body>
		</Card>
	));

	const history = useHistory();
	const logOut = () => {
		firebaseApp.auth().signOut();
		alert("로그아웃 되었습니다.");
		history.push("/");
	};

	// 아무 chatRooms도 없을 때부터 추가하면서 시작하고 싶다.
	//
	const addRoom = (e) => {
		e.preventDefault();
		const { roomId, title, password } = e.target.elements;
		if (roomId.value && title.value && password.value) {
			db.collection("chatrooms")
				.doc("room_" + roomId.value)
				.get()
				.then((doc) => {
					if (doc.data()) {
						alert("해당 번호로 등록된 채팅방이 있습니다.");
					} else {
						const payload = {
							roomId: roomId.value,
							title: title.value,
							password: password.value,
							id: uuidv4(),
							host: email,
							messages: {},
						};

						db.collection("chatrooms")
							.doc("room_" + roomId.value)
							.set({
								roomId: payload.roomId,
								title: payload.title,
								password: payload.password,
								id: payload.id,
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
									roomId: "",
									title: "",
									password: "",
								});
							})
							.catch((error) => {
								alert("haha");
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
		<div>
			<h1>Chat List</h1>
			<div className="header">
				<p>나의 계정 : {email}</p>
				<Button variant="secondary" onClick={logOut}>
					Logout
				</Button>
			</div>

			<div>
				<form onSubmit={addRoom} className="formWrapper">
					<div>채팅방 새로 만들기 - </div>
					<div>
						<label>RoomId : </label>
						<input
							value={inputValue.roomId}
							type="text"
							name="roomId"
							onChange={(e) => onInfoChange(e, "roomId")}
							placeholder="roomId"
						/>
					</div>
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
						<Button variant="secondary" type="submit">
							add Room
						</Button>
					</div>
				</form>
			</div>
			<div className="cardWrapper">{ChattingList}</div>
		</div>
	);
};

export default ChatList;
