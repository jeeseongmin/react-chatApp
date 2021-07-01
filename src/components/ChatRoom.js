import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "react-bootstrap";
import "../chatting.css";

const ChatRoom = (props) => {
	// props로 받아오는 해당 room information
	const chatroomInfo = props.chatroom;

	// props로 받아오는 delete 함수
	const deleteOne = props.deleteOne;

	const enterRoom = props.enterRoom;

	// 맨 앞 index 표시
	const index = props.index * 1 + 1;
	const history = useHistory();

	// const enterChatRoom = (chatroomInfo) => {
	// 	history.push("/chat/room/" + chatroomInfo.id);
	// };

	const LockBadge = (e) => {
		const info = e.isLock;
		console.log(info);
		if (info) {
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
			<LockBadge isLock={chatroomInfo.password} />
			<div className="">
				<h4>{chatroomInfo.title}</h4>
			</div>
			<div className="">
				{chatroomInfo.host.slice(0, chatroomInfo.host.indexOf("@"))}님의 채팅방
			</div>
			<div className="btnWrapper">
				<Button
					variant="primary"
					onClick={(e) => {
						enterRoom(chatroomInfo);
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
	// console.log(prevProps);
	return (
		prevProps.content === nextProps.content && prevProps.id === nextProps.id
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
export default React.memo(ChatRoom, areEqual);
// export default ChatRoom;
