import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import EditChatModal from "./EditChatModal";

import "../chatting.css";
import { db } from "../firebase";
import likeImg from "../image/like.png";
import cutyImg from "../image/cuty.png";
import scaryImg from "../image/scary.png";
import editImg from "../image/edit.png";
import deleteImg from "../image/delete.png";

const Chat = (props) => {
	const [hostName, setHostName] = useState();
	const _chat = props.chat;
	const [chat, setChat] = useState({
		..._chat,
	});
	const uuid = props.uid;
	const deleteChat = props.deleteChat;
	const rid = props.rid;

	const [editChatModalShow, setEditChatModalShow] = useState(false);

	const [chatInfo, setChatInfo] = useState({});
	const [toggleBox, setToggleBox] = useState(false);

	const [likeList, setLikeList] = useState([]);
	const [likeChange, setLikeChange] = useState(false);

	const [cutyList, setCutyList] = useState([]);
	const [cutyChange, setCutyChange] = useState(false);

	const [scaryList, setScaryList] = useState([]);
	const [scaryChange, setScaryChange] = useState(false);

	const [userInfo, setUserInfo] = useState({});
	function test(text) {
		console.log(text);
	}

	// 이모티콘 생성자 함수
	function Imoji(type) {
		this.type = type;
		this.imojiList = function () {
			if (type === "like") {
				return likeList;
			} else if (type === "cuty") {
				return cutyList;
			} else if (type === "scary") {
				return scaryList;
			}
		};
		this.imojiLikeChange = function () {
			if (type === "like") {
				return setLikeChange(!likeChange);
			} else if (type === "cuty") {
				return setCutyChange(!cutyChange);
			} else if (type === "scary") {
				return setScaryChange(!scaryChange);
			}
		};
		this.setList = function (list) {
			if (type === "like") {
				return setLikeList(list);
			} else if (type === "cuty") {
				return setCutyList(list);
			} else if (type === "scary") {
				return setScaryList(list);
			}
		};

		this.getList = async function () {
			try {
				let querySnapshot = await this.getRef().get();
				if (this.type === "like") {
					let imojiList = await querySnapshot.data().like;
				} else if (this.type === "cuty") {
					let imojiList = await querySnapshot.data().cuty;
				} else if (this.type === "scary ") {
					let imojiList = await querySnapshot.data().scary;
				}
				setChatInfo(querySnapshot.data());
				this.setList(this.imojiList());
				// 좋아요인 상태
			} catch (error) {
				console.log(error);
			}
		};
		this.getRef = function () {
			const ref = db
				.collection("chatrooms")
				.doc(rid)
				.collection("messages")
				.doc(chat.docId);
			return ref;
		};
		// 해당 chat에 대해 toggle 시키기
		this.toggle = async function () {
			if (this.imojiList().includes(uuid)) {
				const deleteList = this.imojiList().filter(function (element, index) {
					return element !== uuid;
				});

				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: this.type === "like" ? deleteList : chatInfo.like,
					cuty: this.type === "cuty" ? deleteList : chatInfo.cuty,
					scary: this.type === "scary" ? deleteList : chatInfo.scary,
				});
				this.setList(deleteList);
			}
			// 좋아요 누르지 않은 상태라면, 좋아요 누르기
			else {
				const addList = this.imojiList();
				addList.push(uuid);

				await this.getRef().set({
					uidOfUser: chatInfo.uidOfUser,
					content: chatInfo.content,
					created: chatInfo.created,
					id: chatInfo.id,
					like: this.type === "like" ? addList : chatInfo.like,
					cuty: this.type === "cuty" ? addList : chatInfo.cuty,
					scary: this.type === "scary" ? addList : chatInfo.scary,
				});
				this.setList(addList);
			}

			this.imojiLikeChange();
		};
	}

	var like = new Imoji("like");
	var cuty = new Imoji("cuty");
	var scary = new Imoji("scary");

	useEffect(() => {
		like.getList();
	}, [likeChange]);
	useEffect(() => {
		cuty.getList();
	}, [cutyChange]);
	useEffect(() => {
		scary.getList();
	}, [scaryChange]);

	// 이모티콘 클릭 시 toggle 이벤트
	const imojiToggle = function (type) {
		type.toggle();
	};

	// 맨 처음
	useEffect(() => {
		let getUserInfo = async function () {
			let userRef = await db.collection("user").doc(chat.uidOfUser).get();
			const _user = userRef.data();
			setUserInfo(_user);
		};
		getUserInfo();
	}, []);

	// 해당 chat에 아무 이모티콘도 존재하지 않을 때
	function isEmpty() {
		if (
			likeList.includes(uuid) ||
			cutyList.includes(uuid) ||
			scaryList.includes(uuid)
		) {
			return false;
		} else return true;
	}

	useEffect(() => {
		let loadList = async function () {
			await db
				.collection("chatrooms")
				.doc(rid)
				.collection("messages")
				.doc(chat.docId)
				.get()
				.then((doc) => {
					setLikeList(doc.data().like);
					setCutyList(doc.data().cuty);
					setScaryList(doc.data().scary);
				});
		};
		loadList();
	}, []);

	// chat 수정 시에 리렌더링하기 위한 hook
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

	// 채팅 하단 이모티콘 수를 보여주는 버튼
	const ImojiViewBtn = (props) => {
		const type = props.type;
		const typeList = props.typeList;
		const typeImg = props.typeImg;
		if (typeList.length !== 0) {
			return (
				<Button
					className={isEmpty ? "myimoji imojiBtn" : "imojiBtn"}
					onClick={() => imojiToggle(type)}
				>
					<img src={typeImg} className="viewImojiImg" alt="like" />
					<span className="imojiCount">{typeList.length}</span>
				</Button>
			);
		} else return <span></span>;
	};

	// MouseOver 시에 버튼 목록들을 보여주는 div
	const ImojiHoverDiv = (props) => {
		const type = props.type;
		const typeList = props.typeList;
		const typeImg = props.typeImg;
		return (
			<div
				className={
					typeList.includes(uuid)
						? "imojiToggleOn imojiImgWrapper"
						: "imojiToggleOff imojiImgWrapper"
				}
				onClick={() => imojiToggle(type)}
			>
				<img src={typeImg} className="imojiImg" alt="imoji" />
			</div>
		);
	};

	if (chat.uidOfUser === uuid) {
		return (
			<div
				className={isEmpty ? "chatBox myChat emptyChatBox" : "chatBox myChat"}
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
							<ImojiHoverDiv
								type={like}
								typeList={likeList}
								typeImg={likeImg}
							/>
							<ImojiHoverDiv
								type={cuty}
								typeList={cutyList}
								typeImg={cutyImg}
							/>
							<ImojiHoverDiv
								type={scary}
								typeList={scaryList}
								typeImg={scaryImg}
							/>
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
						<div className="chatSender">
							<span>
								<b>{hostName}</b>
								<img
									alt="guest"
									src={userInfo.imgUrl}
									className="chatProfile_right"
								/>
							</span>
						</div>
						<span className="chatMessage">{chat.content}</span>
						<div className="imojiView">
							<ImojiViewBtn type={like} typeList={likeList} typeImg={likeImg} />
							<ImojiViewBtn type={cuty} typeList={cutyList} typeImg={cutyImg} />
							<ImojiViewBtn
								type={scary}
								typeList={scaryList}
								typeImg={scaryImg}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	} else if (chat.uidOfUser !== uuid) {
		return (
			<div
				className={
					isEmpty ? "chatBox otherChat emptyChatBox" : "chatBox otherChat"
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
							<ImojiHoverDiv
								type={like}
								typeList={likeList}
								typeImg={likeImg}
							/>
							<ImojiHoverDiv
								type={cuty}
								typeList={cutyList}
								typeImg={cutyImg}
							/>
							<ImojiHoverDiv
								type={scary}
								typeList={scaryList}
								typeImg={scaryImg}
							/>
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
						<div className="chatSender">
							<span>
								<img
									alt="guest"
									src={userInfo.imgUrl}
									className="chatProfile_left"
								/>
								<b>{hostName}</b>
							</span>
						</div>
						<span className="chatMessage">{chat.content}</span>
						<div className="imojiView">
							<ImojiViewBtn type={like} typeList={likeList} typeImg={likeImg} />
							<ImojiViewBtn type={cuty} typeList={cutyList} typeImg={cutyImg} />
							<ImojiViewBtn
								type={scary}
								typeList={scaryList}
								typeImg={scaryImg}
							/>
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
