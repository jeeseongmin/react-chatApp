import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { useSelector } from "react-redux";
import EditChatModal from "./EditChatModal";

import "../chatting.css";
import { db } from "../firebase";
import likeImg from "../image/like.png";
import sleepImg from "../image/sleep.png";
import smileImg from "../image/smile.png";
import editImg from "../image/edit.png";
import deleteImg from "../image/delete.png";

const Chat = (props) => {
	const [hostName, setHostName] = useState();
	// console.timeLog("render chat : " + props.chat.id);
	const chats = props.chats;
	const _chat = props.chat;
	const [chat, setChat] = useState({
		..._chat,
	});
	const uuid = props.uid;
	const deleteChat = props.deleteChat;
	const editChat = props.editChat;
	const rid = props.rid;
	const [editChatModalShow, setEditChatModalShow] = useState(false);

	const [isLike, setIsLike] = useState(false);

	const [toggleBox, setToggleBox] = useState(false);

	var like = {
		state: isLike,
		docId: chat.docId,
		uidOfUser: uuid,

		// like 상태 값 저장
		init: function () {
			console.log("init");
			setIsLike(this.getState());
		},

		// 해당 chat에 대한 좋아요 reference 가져오기
		getRef: function () {
			console.log("getRef");
			try {
				let ref = db
					.collection("chatrooms")
					.doc(rid)
					.collection("messages")
					.doc(this.docId);
				return ref;
			} catch (error) {
				console.log(error);
			}
		},

		// 해당 chat에 대한 유저의 좋아요 상태값 가져오기
		getState: async function () {
			console.log("getState");
			try {
				const querySnapshot = await this.getRef().get();
				const likeList = querySnapshot.docs.map((doc) => doc.data());

				console.log(querySnapshot);
				// console.log(likeRef.data());
				console.log(likeList);
				// 좋아요 항목에 있을 때
				// if (likeList.inclues(this.uidOfUser)) {
				// 	return true;
				// }
				// // 좋아요 항목에 없을 때
				// else {
				// 	return false;
				// }
				return likeList;
			} catch (error) {
				console.log("like 없음!!");
				// const querySnapshot = await this.getRef().get();
				// const likeList = querySnapshot.docs.map((doc) => doc.data());

				return true;
			}
		},

		// 해당 chat에 대해 toggle 시키기
		toggle: async function () {
			console.log("toggle");
			// 좋아요 되어있는 상태
			// console.log(this.state);
			if (this.state) {
				// await this.getRef().update({});
				// console.log(this);
			}
			// 좋아요 되어있지 않은 상태
			else {
				console.log("false");
			}
		},
	};

	useEffect(() => {
		like.init();
		like.toggle();
	}, []);

	useEffect(() => {
		let reloadContent = async function () {
			const doc = await db
				.collection("chatrooms")
				.doc(rid)
				.collection("messages")
				.doc(chat.docId)
				.get();
			const newContent = doc.data().content;
			setChat({
				...chat,
				content: newContent,
			});
		};
		reloadContent();
		setToggleBox(false);
	}, [editChatModalShow]);

	const onMouseOver = () => {
		setToggleBox(true);
	};

	const onMouseOut = () => {
		setToggleBox(false);
	};

	useEffect(() => {
		let findHostName = async function (req, res) {
			let sender = await db.collection("user").doc(chat.uidOfUser).get();
			let senderRef = sender.data();
			let host = await senderRef.email.slice(0, senderRef.email.indexOf("@"));
			setHostName(host);
		};

		findHostName();
	}, []);

	// const editModal = async (chat) => {
	// 	setToggleBox(false);
	// 	setEditChatModalShow(true);
	// };

	// 본인의 채팅이면 지울 수 있다.
	// 방 주인도 지울 수 있다.
	// const deleteChat = async () => {
	// 	if (uuid === chat.uidOfUser || uuid === hostId) {
	// 		alert("삭제하기");
	// 		try {
	// 			const chatRef = db
	// 				.collection("chatrooms")
	// 				.doc(rid)
	// 				.collection("messages");
	// 			console.log(chat.id);
	// 			const snapshot = await chatRef.doc(chat.docId).get();
	// 			if (snapshot.empty) {
	// 				alert("없음");
	// 				return;
	// 			} else {
	// 				await chatRef.doc(chat.docId).delete();
	// 				alert("삭제되었습니다!");
	// 				setIsChanged(!isChanged);
	// 			}
	// 		} catch (error) {}
	// 	} else {
	// 		alert("권한이 없습니다.");
	// 		return 0;
	// 	}
	// };

	/* 카톡처럼 구현
	본인 것이면 우측에 놓기
	다른 사람 것이면 좌측에 놓기
	*/

	if (chat.uidOfUser === uuid) {
		return (
			<div
				className="chatBox myChat"
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseOut}
			>
				<EditChatModal
					show={editChatModalShow}
					onHide={() => setEditChatModalShow(false)}
					uid={uuid}
					chat={chat}
					rid={rid}
				/>
				{toggleBox && (
					<div className="imojiMyWrapper">
						<div className="imojiBox" toggle>
							<div className="imojiImgWrapper">
								<img
									src={likeImg}
									className="imojiImg"
									alt="like"
									onClick={() => alert("like")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={smileImg}
									className="imojiImg"
									alt="smile"
									onClick={() => alert("smile")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={sleepImg}
									className="imojiImg"
									alt="sleep"
									onClick={() => alert("sleep")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={editImg}
									className="imojiImg"
									alt="edit"
									onClick={() => setEditChatModalShow(true)}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={deleteImg}
									className="imojiImg"
									alt="delete"
									onClick={() => deleteChat(chat)}
								/>
							</div>
						</div>
					</div>
				)}
				<div className="messageWrapper myChat">
					<div>
						<div className="chatSender">{hostName}</div>
						<span className="imojiView">
							<Button>like</Button>
							<Button>sleep</Button>
							<Button>haha</Button>
						</span>
						<span className="chatMessage">{chat.content}</span>
					</div>
				</div>
			</div>
		);
	} else if (chat.uidOfUser !== uuid) {
		return (
			<div
				className="chatBox otherChat"
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseOut}
			>
				<EditChatModal
					show={editChatModalShow}
					onHide={() => setEditChatModalShow(false)}
					uid={uuid}
					chat={chat}
					rid={rid}
				/>
				{toggleBox && (
					<div className="imojiOtherWrapper">
						<div className="imojiBox" toggle>
							<div className="imojiImgWrapper">
								<img
									src={likeImg}
									className="imojiImg"
									alt="like"
									onClick={() => alert("like")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={smileImg}
									className="imojiImg"
									alt="smile"
									onClick={() => alert("smile")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={sleepImg}
									className="imojiImg"
									alt="sleep"
									onClick={() => alert("sleep")}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={editImg}
									className="imojiImg"
									alt="edit"
									onClick={() => setEditChatModalShow(true)}
								/>
							</div>
							<div className="imojiImgWrapper">
								<img
									src={deleteImg}
									className="imojiImg"
									alt="delete"
									onClick={() => deleteChat(chat)}
								/>
							</div>
						</div>
					</div>
				)}
				<div className="messageWrapper otherChat">
					<div>
						<div className="chatSender">{hostName}</div>
						<span className="chatMessage">{chat.content}</span>
						<span className="imojiView">
							<Button>like</Button>
							<Button>sleep</Button>
							<Button>haha</Button>
						</span>
					</div>
				</div>
			</div>
		);
	}
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.chats === nextProps.chats &&
		prevProps.chat === nextProps.chat &&
		prevProps.content === nextProps.content &&
		prevProps.id === nextProps.id
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
export default React.memo(Chat, areEqual);
// export default Chat;
