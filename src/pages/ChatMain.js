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
import guest from "../image/guest.png";

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
	const [userInfo, setUserInfo] = useState({});
	const [payload, setPayload] = useState({});
	const [modalShow, setModalShow] = useState(false);
	const [toggleState, setToggleState] = useState(false);
	const [acceptList, setAcceptList] = useState([]);

	const [isChanged, setIsChanged] = useState(false);

	// 로그인 한 유저가 aceept 되어있는 목록

	useEffect(() => {
		let getInfo = async function () {
			const doc = await db.collection("user").doc(uid).get();
			setUserInfo(doc.data());
		};
		getInfo();
	}, []);

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
	}, [isChanged, toggleState]);

	useEffect(() => {
		const getAcceptList = async function (req, res) {
			let cp = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();
			setAcceptList(cp.data().acceptRoom);
		};
		getAcceptList();
	}, [toggleState]);

	const logOut = () => {
		firebaseApp.auth().signOut();
		alert("로그아웃 되었습니다.");
		history.push("/");
	};

	const addRooms = async (payload) => {
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
		if (acceptRooms || chatroomInfo.password === "") {
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
		try {
			const doc = await db.collection("chatrooms").doc(deleteId).get();
			const deletePassword = doc.data().password;
			if (email === doc.data().host) {
				const answer = prompt("비밀번호를 입력해주세요.");
				if (answer === deletePassword) {
					await db
						.collection("chatrooms")
						.doc(deleteId)
						.delete()
						.then(() => {
							const cp = chatrooms.filter(function (element) {
								return element.id !== deleteId;
							});
							// setChatrooms(cp);
							alert("삭제되었습니다.");
							console.log("삭제");
						});
					await setIsChanged(!isChanged);
					console.log(chatrooms);
				} else {
					alert("비밀번호가 틀렸습니다.");
				}
			} else {
				alert("작성자만 삭제할 수 있습니다.");
			}
		} catch (error) {
			alert("이미 삭제된 방입니다.");
		}
	};

	const acceptInvite = async function (rid, uid, setWRoom, setARoom) {
		// 먼저 방에 있는 거 뺴기.
		try {
			const cp_room = await db
				.collection("chatrooms")
				.doc(rid)
				.collection("invitation")
				.doc("type")
				.get();
			const wList = cp_room.data().waiting;
			const aList = cp_room.data().accept;
			const rList = cp_room.data().reject;

			// 대기 리스트에서 빼기
			const cp_wList = await wList.filter(function (element) {
				return element !== uid;
			});

			// 수락 리스트에 더하기.
			const cp_aList = [...aList, uid];

			await db
				.collection("chatrooms")
				.doc(rid)
				.collection("invitation")
				.doc("type")
				.set({
					waiting: cp_wList,
					accept: cp_aList,
					reject: rList,
				});

			// 유저 리스트 불러오기
			const cp_user = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();

			const wList_user = cp_user.data().waitingRoom;
			const aList_user = cp_user.data().acceptRoom;
			const rList_user = cp_user.data().rejectRoom;

			// 대기 리스트에서 빼기
			const cp_wList_user = await wList_user.filter(function (element) {
				return element !== rid;
			});

			// 수락 리스트에 더하기.
			const cp_aList_user = [...aList_user, rid];
			setWRoom(cp_wList_user);
			setARoom(cp_aList_user);
			await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.set({
					waitingRoom: cp_wList_user,
					acceptRoom: cp_aList_user,
					rejectRoom: rList_user,
				});
			setToggleState(!toggleState);
			alert("수락하였습니다.");
		} catch (error) {
			console.log(error);
		}
	};

	const rejectInvite = async function (rid, uid, setWRoom, setRRoom) {
		try {
			const cp_room = await db
				.collection("chatrooms")
				.doc(rid)
				.collection("invitation")
				.doc("type")
				.get();
			const wList = cp_room.data().waiting;
			const aList = cp_room.data().accept;
			const rList = cp_room.data().reject;

			// 대기 리스트에서 빼기
			const cp_wList = await wList.filter(function (element) {
				return element !== uid;
			});

			// 수락 리스트에 더하기.
			const cp_rList = [...rList, uid];

			await db
				.collection("chatrooms")
				.doc(rid)
				.collection("invitation")
				.doc("type")
				.set({
					waiting: cp_wList,
					accept: aList,
					reject: cp_rList,
				});

			// 유저 리스트 불러오기
			const cp_user = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();

			const wList_user = cp_user.data().waitingRoom;
			const aList_user = cp_user.data().acceptRoom;
			const rList_user = cp_user.data().rejectRoom;

			// 대기 리스트에서 빼기
			const cp_wList_user = await wList_user.filter(function (element) {
				return element !== rid;
			});

			// 수락 리스트에 더하기.
			const cp_rList_user = [...rList_user, rid];
			setWRoom(cp_wList_user);
			setRRoom(cp_rList_user);
			await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.set({
					waitingRoom: cp_wList_user,
					acceptRoom: aList_user,
					rejectRoom: cp_rList_user,
				});

			alert("거절하였습니다.");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="chatListWrapper">
			<MyInvitationModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				uid={uid}
				acceptInvite={acceptInvite}
				rejectInvite={rejectInvite}
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
				<div className="mainInfoWrapper">
					<img
						alt="mainProfile"
						className="mainProfile"
						src={userInfo.imgUrl}
					/>
					<h4>{userInfo.nickName}님 환영합니다.</h4>
				</div>
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
							chatrooms={chatrooms}
							index={index}
							key={index}
							uid={uid}
							deleteOne={deleteRoom}
							enterRoom={enterChatRoom}
							acceptRooms={acceptList}
						/>
					);
					// 허락된 room들
				})}
			</div>
		</div>
	);
};

export default ChatMain;
