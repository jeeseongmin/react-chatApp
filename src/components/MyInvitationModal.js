import React, { useState, useEffect } from "react";
import { Button, Modal, Badge, Accordion, Card } from "react-bootstrap";
import _default from "react-bootstrap/esm/CardColumns";
import { db, firebaseApp, firebase } from "../firebase";
import guestImg from "../image/guest.png";

const MyInvitationModal = (props) => {
	const uid = props.uid;
	const [invitationList, setInvitationList] = useState([]);

	const [chatrooms, setChatrooms] = useState([]);
	const [wRoom, setWRoom] = useState([]);
	const [aRoom, setARoom] = useState([]);
	const [rRoom, setRRoom] = useState([]);

	/* 
		1. 모든 방에 있는 invitation 불러오기 
	*/

	useEffect(() => {
		const setting = async function (req, res) {
			let querySnapshot = await db.collection("chatrooms").get();
			setChatrooms(querySnapshot.docs.map((doc) => doc.data()));
		};
		setting();
	}, []);

	useEffect(() => {
		chatrooms.map(() => {});
	});

	useEffect(() => {
		const getWatingList = async function (req, res) {
			let cp = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();
			setWRoom(cp.data().waitingRoom);
			console.log(cp.data());
		};
		getWatingList();
	}, []);

	useEffect(() => {
		const getAcceptList = async function (req, res) {
			let cp = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();
			setARoom(cp.data());
		};
		getAcceptList();
	}, []);

	useEffect(() => {
		const getRejectList = async function (req, res) {
			let cp = await db
				.collection("user")
				.doc(uid)
				.collection("invitation")
				.doc("type")
				.get();
			setRRoom(cp.data());
		};
		getRejectList();
	}, []);

	// useEffect(() => {
	// 	console.log("view");
	// 	console.log(wRoom);
	// 	console.log(aRoom);
	// 	console.log(rRoom);
	// 	if (wRoom.length > 0) {
	// 		const wait = wRoom.map(async (element, index) => {
	// 			const roomRef = await db.collection("chatrooms").doc(element).get();
	// 			const roomInfo = roomRef.data();
	// 			console.log(roomInfo);
	// 			return {
	// 				status: "waiting",
	// 				rid: element,
	// 				title: roomInfo.title,
	// 				host: roomInfo.host,
	// 			};
	// 		});
	// 		// setWRoom(wait);
	// 	}
	// 	if (aRoom.length > 0) {
	// 		const accept = aRoom.map(async (element, index) => {
	// 			const roomRef = await db.collection("chatrooms").doc(element).get();
	// 			const roomInfo = roomRef.data();
	// 			console.log(roomInfo);
	// 			return {
	// 				status: "accept",
	// 				rid: element,
	// 				title: roomInfo.title,
	// 				host: roomInfo.host,
	// 			};
	// 		});
	// 		// setARoom(accept);
	// 	}

	// 	if (wRoom.length > 0) {
	// 		const reject = wRoom.map(async (element, index) => {
	// 			const roomRef = await db.collection("chatrooms").doc(element).get();
	// 			const roomInfo = roomRef.data();
	// 			console.log(roomInfo);
	// 			return {
	// 				status: "reject",
	// 				rid: element,
	// 				title: roomInfo.title,
	// 				host: roomInfo.host,
	// 			};
	// 		});
	// 		// setRRoom(reject);
	// 	}
	// });

	// 수락 하면 두 개 다 변해야 함.
	const acceptInvite = async function (rid, uid) {
		console.log("haha");
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
			console.log(cp_wList);

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

			alert("수락하였습니다.");
		} catch (error) {
			console.log(error);
		}
	};

	const rejectInvite = async function (rid, uid) {
		console.log(rid);

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
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<b>초대 내역</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="myDivWrapper">
					{chatrooms.map((room, index) => {
						if (wRoom.indexOf(room.id) !== -1) {
							return (
								<div className="divBox">
									<div>
										<Badge variant="success" className="invite_userProfile">
											<img
												alt="guest"
												src={guestImg}
												className="invite_userimg"
											/>
										</Badge>
									</div>
									<div className="senderNameWrapper">
										<h5>
											<b>{room.title}</b>
										</h5>
										<h5>
											<b>{room.host}님이 초대하셨습니다.</b>
										</h5>
									</div>
									<div className="myDivBtnWrapper">
										<Button
											variant="success"
											onClick={() => acceptInvite(room.id, uid)}
										>
											수락
										</Button>
										<Button
											variant="danger"
											onClick={() => rejectInvite(room.id, uid)}
										>
											거절
										</Button>
									</div>
								</div>
							);
						}
					})}
					{wRoom.length === 0 && (
						<div>
							<b>초대 내역이 없습니다.</b>
						</div>
					)}
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default MyInvitationModal;
