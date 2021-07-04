import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "react-bootstrap";
import "../chatting.css";
import { db, firebaseApp, firebase } from "../firebase";

const ChatRoom = (props) => {
	// props로 받아오는 해당 room information
	const chatroomInfo = props.chatroom;
	const uid = props.uid;
	const chatrooms = props.chatrooms;

	// props로 받아오는 delete 함수
	const deleteOne = props.deleteOne;
	const enterRoom = props.enterRoom;
	const acceptRooms = props.acceptRooms;

	const [nickName, setNickName] = useState();

	useEffect(() => {
		let getHostName = async function () {
			try {
				const info = await db
					.collection("user")
					.doc(chatroomInfo.uidOfUser)
					.get();
				setNickName(info.data().nickName);
			} catch (error) {
				console.log(error);
			}
		};
		getHostName();
	}, []);
	// 맨 앞 index 표시
	const index = props.index * 1 + 1;
	const LockBadge = (e) => {
		const info = e.isLock;
		const rid = e.rid;

		if (acceptRooms.includes(rid) || chatroomInfo.uidOfUser === uid) {
			return (
				<Badge variant="success" className="lockBadge">
					Accept
				</Badge>
			);
		} else if (info) {
			return (
				<Badge variant="danger" className="lockBadge">
					Lock
				</Badge>
			);
		} else {
			return (
				<Badge variant="success" className="lockBadge">
					unLock
				</Badge>
			);
		}
	};

	return (
		<div className="chatroom">
			<Badge variant="success" className="idBadge">
				{index}
			</Badge>
			<LockBadge isLock={chatroomInfo.password} rid={chatroomInfo.id} />
			<div className="chatRoomTitle">{chatroomInfo.title}</div>
			<div className="chatRoomTitle">{nickName}님의 채팅방</div>
			<div className="btnWrapper">
				<Button
					variant="primary"
					onClick={(e) => {
						enterRoom(chatroomInfo, acceptRooms.includes(chatroomInfo.id));
					}}
					className="enterBtn"
					key={index}
				>
					입장
				</Button>

				<Button
					variant="danger"
					className="deleteBtn"
					value={chatroomInfo.id}
					onClick={deleteOne}
				>
					삭제
				</Button>
			</div>
		</div>
	);
};

/* 
    useMemo로써, 이전 항목과 다음 항목이 달라졌을 때, 
    즉 새로 업로드 되었을 떄 달라진다.
*/

// 삭제했을 때에는 memo에 어떻게 적용시켜야 할까?
const areEqual = (prevProps, nextProps) => {
	console.log("props");
	console.log(prevProps);

	console.log(nextProps);
	return (
		prevProps.content === nextProps.content &&
		prevProps.id === nextProps.id &&
		prevProps.acceptRooms === nextProps.acceptRooms &&
		prevProps.chatrooms === nextProps.chatrooms
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
export default React.memo(ChatRoom, areEqual);
// export default ChatRoom;
