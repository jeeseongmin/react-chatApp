import React, { useState, useEffect } from "react";
import { Button, Modal, Badge, Accordion, Card } from "react-bootstrap";
import _default from "react-bootstrap/esm/CardColumns";
import { db, firebaseApp, firebase } from "../firebase";
import guestImg from "../image/guest.png";

const EditChatModal = (props) => {
	const uid = props.uid;
	const _roomInfo = props.roominfo;
	// const editChat = props.editChat;
	const chat = props.chat;
	const rid = props.rid;

	const [chatInfo, setChatInfo] = useState(chat);

	const [editChat, setEditChat] = useState({
		...chatInfo,
		content: "",
	});

	const onInfoChange = (e, key) => {
		const cp = { ...editChat };
		cp[key] = e.target.value;
		setEditChat(cp);
	};

	useEffect(() => {
		const setting = async function (req, res) {
			try {
			} catch (error) {
				console.log("오류있어요");
			}
		};
		// setting();
	}, []);

	const goBack = async function (type) {
		if (!type) {
			setEditChat({
				...chat,
				content: "",
			});
		}
		props.onHide(false);
		// await setEditModalShow(false);
	};

	const submit = async function (chat) {
		if (editChat.content === "") {
			alert("내용을 입력해주세요!");
			return;
		} else {
			try {
				const payload = {
					content: editChat.content,
					id: editChat.id,
					uidOfUser: editChat.uidOfUser,
					created: editChat.created,
					edited: firebase.firestore.Timestamp.now().seconds,
				};
				// console.log(payload);
				await db
					.collection("chatrooms")
					.doc(rid)
					.collection("messages")
					.doc(chat.docId)
					.set(payload)
					.then(() => {
						alert("수정되었습니다.");
						setChatInfo({
							...payload,
							docId: chat.docId,
						});
						goBack(true);
					});
				// goBack(true);

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
					<b>채팅 수정</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="editChattingWrapper">
					<div className="editChatBox">
						<div className="editChatWrapper">
							<div>
								<p className="editChatText">이전 채팅 : </p>
								<input
									value={chat.content}
									className="editChatInput"
									readOnly
								/>
							</div>
							<div>
								<p className="editChatText">내용 변경 : </p>
								<input
									value={editChat.content}
									type="text"
									className="editChatInput"
									onChange={(e) => onInfoChange(e, "content")}
									placeholder="변경할 내용을 입력하세요"
								/>
							</div>
						</div>
					</div>
					<div className="editRoomBtnWrapper">
						<Button
							variant="success"
							className="acceptEditRoom"
							onClick={() => submit(chat)}
						>
							수정
						</Button>
						{/* <Button variant="danger" onClick={() => goBack(false)}>
							취소
						</Button> */}
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

// 삭제했을 때에는 memo에 어떻게 적용시켜야 할까?
const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.chat.content === nextProps.chat.content &&
		prevProps.show === nextProps.show
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
// export default ChatRoom;

export default React.memo(EditChatModal, areEqual);
// export default EditRoomModal;
