import React from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "react-bootstrap";
import "../chatting.css";
import { db, firebaseApp, firebase } from "../firebase";
import { useSelector } from "react-redux";

const ChatRoom = (props) => {
	const chatroom = props.chatroom;
	const email = useSelector((state) => state.user.email);

	const index = props.index * 1 + 1;
	const history = useHistory();

	const enterChatRoom = (chatroom) => {
		history.push("/chat/room/" + chatroom.id);
	};
	const deleteRoom = (e) => {
		const deleteId = e.target.value;
		db.collection("chatrooms")
			.doc(chatroom.id)
			.get()
			.then((doc) => {
				const deletePassword = doc.data().password;
				if (email === doc.data().host) {
					console.log(deletePassword);
					const answer = prompt("비밀번호를 입력해주세요.");
					if (answer === deletePassword) {
						db.collection("chatrooms").doc(deleteId).delete();
						alert("삭제되었습니다.");
					} else {
						alert("비밀번호가 틀렸습니다.");
					}
				} else {
					alert("작성자만 삭제할 수 있습니다.");
				}
			});
	};
	return (
		<div className="chatroom">
			<Badge variant="success" className="idBadge">
				{index}
			</Badge>
			<div className="">
				<h4>{chatroom.title}</h4>
			</div>
			<div className="">
				{chatroom.host.slice(0, chatroom.host.indexOf("@"))}님의 채팅방
			</div>
			<div className="btnWrapper">
				<Button
					variant="primary"
					onClick={(e) => {
						enterChatRoom(chatroom);
					}}
					className="enterBtn"
					key={index}
				>
					입장
				</Button>
				<Button
					variant="danger"
					className="deleteBtn"
					value={chatroom.id}
					onClick={deleteRoom}
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
const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.content === nextProps.content && prevProps.id === nextProps.id
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
export default React.memo(ChatRoom, areEqual);
// export default ChatRoom;
