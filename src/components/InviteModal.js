import React, { useState, useEffect } from "react";
import { Button, Modal, Badge } from "react-bootstrap";
import _default from "react-bootstrap/esm/CardColumns";
import { db, firebaseApp, firebase } from "../firebase";
import guestImg from "../image/guest.png";
const InviteModal = (props) => {
	const uid = props.uid;
	const rid = props.rid;
	const [peopleList, setPeopleList] = useState([]);

	const [waitingList, setWaitingList] = useState([]);
	const [acceptList, setAcceptList] = useState([]);
	const [rejectList, setRejectList] = useState([]);

	useEffect(() => {
		const listing = async function () {
			try {
				const cp = await db
					.collection("chatrooms")
					.doc(rid)
					.collection("invitation")
					.doc("type")
					.get();
				console.log(cp.data());
				const wList = cp.data().waiting;
				setWaitingList(wList);
				const aList = cp.data().accept;
				setAcceptList(aList);
				const rList = cp.data().reject;
				setRejectList(rList);
			} catch (error) {
				await db
					.collection("chatrooms")
					.doc(rid)
					.collection("invitation")
					.doc("type")
					.set({
						waiting: [],
						accept: [],
						reject: [],
					});
			}
		};
		listing();
	}, []);

	useEffect(() => {
		const listUp = async function () {
			let querySnapshot = await db.collection("user").get();
			setPeopleList(querySnapshot.docs.map((doc) => doc.data()));
		};
		listUp();
	}, []);

	// 1. 유저가 메인에서 자신이 초대장 온 거 확인.
	// 2. 방에서 호스트가 확인.

	/* 
		보냈을 때,  
		1. state에 있는 값인지 확인한다.
		2. state에 있는 값이면 
	*/
	const sendInvitation = async function (idList) {
		// const idList = props.idList;
		const receiver = idList.receiver;
		const rid = idList.rid;
		const uid = idList.uid;

		// 있는 거니까 추가하면 안됨.
		// indexOf = -1이면 없는 것
		// 대기 순위에 없으면 ㄱㄱ

		await db
			.collection("chatrooms")
			.doc(rid)
			.collection("invitation")
			.doc("type")
			.set({
				waiting: [...waitingList, receiver],
				accept: acceptList,
				reject: rejectList,
			});
		setWaitingList([...waitingList, receiver]);
	};

	// 대기 중인 사람 취소하기.
	const backInvitation = async function (idList) {
		const receiver = idList.receiver;
		const rid = idList.rid;
		const uid = idList.uid;

		// indexOf가 -1이면 없는 것
		// 대기순위에 있으면 ㄱㄱ
		if (waitingList.indexOf(receiver) !== -1) {
			console.log("back test");
			const cp = await waitingList.filter(function (element) {
				return element !== receiver;
			});
			await db
				.collection("chatrooms")
				.doc(rid)
				.collection("invitation")
				.doc("type")
				.set({
					waiting: cp,
					accept: acceptList,
					reject: rejectList,
				});
			setWaitingList(cp);
		}
	};

	function InviteButton(props) {
		const person = props.person;
		const uid = props.uid;
		const rid = props.rid;
		const receiver = person.uid;
		const idList = {
			uid: uid,
			rid: rid,
			receiver: receiver,
		};

		// 대기 중일 때는 다시 누르면 취소할 수 있게 바꾸기.
		if (waitingList.indexOf(receiver) !== -1) {
			return (
				<Button variant="secondary" onClick={() => backInvitation(idList)}>
					대기
				</Button>
			);
		} else if (acceptList.indexOf(receiver) !== -1) {
			return (
				<Button variant="success" uid={uid} rid={rid} receiver={receiver}>
					수락
				</Button>
			);
		} else if (rejectList.indexOf(receiver) !== -1) {
			return (
				<Button variant="danger" uid={uid} rid={rid} receiver={receiver}>
					거절
				</Button>
			);
		} else {
			return (
				<Button variant="light" onClick={() => sendInvitation(idList)}>
					초대
				</Button>
			);
		}
	}
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<b>초대장</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="userListWrapper">
					{peopleList.map((person, index) => {
						if (person.uid !== uid) {
							return (
								<div className="userBox">
									<div>
										<Badge variant="success" className="invite_userProfile">
											<img
												alt="guest"
												src={guestImg}
												className="invite_userimg"
											/>
										</Badge>
									</div>
									<div className="invite_userName">
										<h5>
											<b>{person.email}</b>
										</h5>
									</div>
									<div>
										<InviteButton person={person} uid={uid} rid={rid} />
									</div>
								</div>
							);
						}
					})}
				</div>
			</Modal.Body>
		</Modal>
	);
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.content === nextProps.content && prevProps.id === nextProps.id
	);
};

export default React.memo(InviteModal, areEqual);
// export default InviteModal;
