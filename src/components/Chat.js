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

	const [chatInfo, setChatInfo] = useState({});
	const [likeList, setLikeList] = useState([]);
	const [likeFlag, setLikeFlag] = useState(false);

	const [toggleBox, setToggleBox] = useState(false);

	var like = {
		// likeList 불러오기
		getList: async function () {
			const querySnapshot = await this.getRef().get();
			let _likeList = await querySnapshot.data().like;
			setChatInfo(querySnapshot.data());
			setLikeList(_likeList);
			console.log(likeList);
		},

		// 해당 chat에 대한 좋아요 reference 가져오기
		getRef: function () {
			const ref = db
				.collection("chatrooms")
				.doc(rid)
				.collection("messages")
				.doc(chat.docId);
			return ref;
		},

		// 해당 chat에 대해 toggle 시키기
		toggle: async function () {
			if (likeList.includes(uuid)) {
				alert("취소");
				console.log("좋아요 취소!");
				const deleteList = likeList.filter(function (element, index) {
					return element !== uuid;
				});

				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: deleteList,
				});
			}
			// 좋아요 누르지 않은 상태라면, 좋아요 누르기
			else {
				alert("좋아요");
				console.log("좋아요 하기");
				const addList = likeList;
				addList.push(uuid);
				console.log(addList);

				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: addList,
				});
			}

			setLikeFlag(!likeFlag);
		},
	};

	useEffect(() => {
		like.getList();
	}, [likeFlag]);

	const likeToggle = function () {
		like.toggle();
	};

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
									onClick={likeToggle}
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
									onClick={likeToggle}
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
