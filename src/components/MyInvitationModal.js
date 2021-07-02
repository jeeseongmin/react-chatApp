import React, { useState, useEffect } from "react";
import { Button, Modal, Badge, Accordion, Card } from "react-bootstrap";
import _default from "react-bootstrap/esm/CardColumns";
import { db, firebaseApp, firebase } from "../firebase";
import guestImg from "../image/guest.png";

const MyInvitationModal = (props) => {
	const uid = props.uid;

	const [chatrooms, setChatrooms] = useState([]);
	const [wRoom, setWRoom] = useState([]);
	const [aRoom, setARoom] = useState([]);
	const [rRoom, setRRoom] = useState([]);
	const acceptInvite = props.acceptInvite;
	const rejectInvite = props.rejectInvite;

	useEffect(() => {
		const setting = async function (req, res) {
			let querySnapshot = await db.collection("chatrooms").get();
			setChatrooms(querySnapshot.docs.map((doc) => doc.data()));
		};
		setting();
	}, []);

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
											<b>[{room.title}]</b>
										</h5>
										<h5>
											<b>{room.host}님이 초대하셨습니다.</b>
										</h5>
									</div>
									<div className="myDivBtnWrapper">
										<Button
											variant="success"
											onClick={() =>
												acceptInvite(room.id, uid, setWRoom, setARoom)
											}
										>
											수락
										</Button>
										<Button
											variant="danger"
											onClick={() =>
												rejectInvite(room.id, uid, setWRoom, setRRoom)
											}
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
