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
	const [toggleBox, setToggleBox] = useState(false);

	const [likeList, setLikeList] = useState([]);
	const [likeChange, setLikeChange] = useState(false);

	const [prettyList, setPrettyList] = useState([]);
	const [prettyChange, setPrettyChange] = useState(false);

	const [scaryList, setScaryList] = useState([]);
	const [scaryChange, setScaryChange] = useState(false);

	var imoji = {
		// likeList 불러오기
		getList: async function () {
			try {
				let querySnapshot = await this.getRef().get();
				let _likeList = await querySnapshot.data().like;
				setChatInfo(querySnapshot.data());
				setLikeList(_likeList);
				// 좋아요인 상태
			} catch (error) {
				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: [],
				});
			}
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
				const addList = likeList;
				addList.push(uuid);

				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: addList,
				});
			}
			setLikeChange(!likeChange);
		},
	};

	useEffect(() => {
		imoji.getList();
	}, [likeChange]);

	const likeToggle = function () {
		imoji.toggle();
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

	if (chat.uidOfUser === uuid) {
		return (
			<div
				className={
					likeList.length === 0
						? "chatBox myChat emptyChatBox"
						: "chatBox myChat"
				}
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
							<div
								className={
									likeList.includes(uuid)
										? "imojiToggleOn imojiImgWrapper"
										: "imojiToggleOff imojiImgWrapper"
								}
							>
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
						<span className="chatMessage">{chat.content}</span>
						<div className="imojiView">
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	} else if (chat.uidOfUser !== uuid) {
		return (
			<div
				className={
					likeList.length === 0
						? "chatBox otherChat emptyChatBox"
						: "chatBox otherChat"
				}
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
							<div
								className={
									likeList.includes(uuid)
										? "imojiToggleOn imojiImgWrapper"
										: "imojiToggleOff imojiImgWrapper"
								}
							>
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
						<div className="imojiView">
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
							{likeList.length !== 0 && (
								<Button
									className={
										likeList.includes(uuid) ? "myimoji imojiBtn" : "imojiBtn"
									}
								>
									<img
										src={likeImg}
										className="viewImojiImg"
										alt="like"
										onClick={likeToggle}
									/>
									<span className="imojiCount">{likeList.length}</span>
								</Button>
							)}
						</div>
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
