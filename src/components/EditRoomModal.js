import React, { useState, useEffect } from "react";
import { Button, Modal, Badge, Accordion, Card } from "react-bootstrap";
import _default from "react-bootstrap/esm/CardColumns";
import { db, firebaseApp, firebase } from "../firebase";
import guestImg from "../image/guest.png";

const EditRoomModal = (props) => {
	const uid = props.uid;
	const _roomInfo = props.roominfo;

	const [roomInfo, setRoomInfo] = useState(_roomInfo);

	const [editInfo, setEditInfo] = useState({
		title: _roomInfo.title,
		password: "",
		passwordCheck: "",
		// edited: firebase.firestore.Timestamp.now().seconds,
	});

	const onInfoChange = (e, key) => {
		const cp = { ...editInfo };
		cp[key] = e.target.value;
		setEditInfo(cp);
	};

	useEffect(() => {
		const setting = async function (req, res) {
			try {
				// let querySnapshot = await db.collection("chatrooms").doc(rid).get();
				// setRoomInfo(querySnapshot.data());
				setEditInfo({
					title: roomInfo.title,
					password: "",
					passwordCheck: "",
					edited: "",
				});
			} catch (error) {
				console.log("오류있어요");
			}
		};
		setting();
	}, []);

	const goBack = async function (type) {
		if (!type) {
			setEditInfo({
				title: roomInfo.title,
				password: "",
				passwordCheck: "",
			});
		}
		props.onHide(false);
		// await setEditModalShow(false);
	};

	const submit = async function (rid, uid) {
		if (editInfo.title === "") {
			alert("제목을 입력해주세요!");
			return 0;
		} else if (editInfo.password !== editInfo.passwordCheck) {
			alert("비밀번호를 다시 확인해주세요!");
			return 0;
		} else {
			try {
				const payload = {
					title: editInfo.title,
					password: editInfo.password,
					host: roomInfo.host,
					id: roomInfo.id,
					uidOfUser: roomInfo.uidOfUser,
					edited: firebase.firestore.Timestamp.now().seconds,
				};
				await db
					.collection("chatrooms")
					.doc(roomInfo.id)
					.set(payload)
					.then(() => {
						setRoomInfo(payload);
						alert("수정되었습니다.");
						setEditInfo({
							title: payload.title,
							password: "",
							passwordCheck: "",
						});
						goBack(true);
					});
				// set
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<Modal
			{...props}
			size="mid"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<b>채팅방 정보 수정</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="editRoomWrapper">
					<div className="editRoomBox">
						<div className="editInfoWrapper">
							<div>
								<p className="editInfoText">방 제목 : </p>
								<input
									value={editInfo.title}
									className="editInfoInput"
									onChange={(e) => onInfoChange(e, "title")}
									placeholder="이메일을 입력하세요"
								/>
							</div>
							<div>
								<p className="editInfoText">패스워드 : </p>
								<input
									value={editInfo.password}
									type="password"
									className="editInfoInput"
									onChange={(e) => onInfoChange(e, "password")}
									placeholder="비밀번호를 입력하세요"
								/>
							</div>
							<div>
								<p className="editInfoText">패스워드 확인 : </p>
								<input
									value={editInfo.passwordCheck}
									type="password"
									className="editInfoInput"
									onChange={(e) => onInfoChange(e, "passwordCheck")}
									placeholder="비밀번호를 입력하세요"
								/>
							</div>
							{/* <div>
								<span>닉네임 : </span>
								<input
									value={editInfo.nickName}
									onChange={(e) => onInfoChange(e, "nickName")}
									placeholder="닉네임을 입력하세요"
								/>
							</div> */}
						</div>
					</div>
					<div className="editRoomBtnWrapper">
						<Button
							variant="success"
							className="acceptEditRoom"
							onClick={submit}
						>
							수정
						</Button>
						<Button variant="danger" onClick={() => goBack(false)}>
							취소
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

// 삭제했을 때에는 memo에 어떻게 적용시켜야 할까?
const areEqual = (prevProps, nextProps) => {
	// console.log("prevProps");
	// console.log(prevProps.roominfo);
	return (
		prevProps.roominfo === nextProps.roominfo &&
		prevProps.show === nextProps.show
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
// export default ChatRoom;

export default React.memo(EditRoomModal, areEqual);
// export default EditRoomModal;
