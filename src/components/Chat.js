import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../chatting.css";
import { db } from "../firebase";

const Chat = (props) => {
	const [hostName, setHostName] = useState();
	console.timeLog("render chat" + props.chat.uid);
	const chat = props.chat;
	const uuid = props.uid;
	const chatBox = useRef(null);

	const [toggleBox, setToggleBox] = useState(false);
	const [toggleMe, setToggleMe] = useState(false);

	const onMouseOver = () => {
		setToggleBox(true);
	};

	const onMouseOut = () => {
		setToggleBox(false);
	};

	const onMouseOver2 = () => {
		setToggleMe(true);
	};

	const onMouseOut2 = () => {
		setToggleMe(false);
	};

	console.log(chat.uidOfUser);

	useEffect(() => {
		function fetchHost() {
			return new Promise(async (resolve, reject) => {
				const senderRef = await db.collection("user").doc(chat.uidOfUser).get();
				let ref = senderRef.data();
				let host = ref.email.slice(0, ref.email.indexOf("@"));
				resolve(host);
			});
		}

		async function findSender() {
			const result = await fetchHost();
			setHostName(result);
		}
		findSender();
	}, []);

	/* 카톡처럼 구현
	본인 것이면 우측에 놓기
	다른 사람 것이면 좌측에 놓기
	*/
	if (chat.uidOfUser === uuid) {
		return (
			<div
				className="chatBox myChat"
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut}
			>
				{toggleBox && (
					<div
						className="additionBox"
						onMouseOver={onMouseOver2}
						onMouseOut={onMouseOut2}
					>
						<div>like</div>
						<div>dislike</div>
						<div>edit</div>
						<div>delete</div>
					</div>
				)}
				<div className="messageWrapper myChat">
					<div className="chatSender">{hostName}</div>
					<div className="chatMessage">{chat.content}</div>
				</div>
			</div>
		);
	} else if (chat.uidOfUser !== uuid) {
		return (
			<div className="chatBox otherChat">
				<div className="messageWrapper otherChat">
					<div className="chatSender">{hostName}</div>
					<div className="chatMessage">{chat.content}</div>
				</div>
			</div>
		);
	}
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.content === nextProps.content && prevProps.id === nextProps.id
	);
};

// useMemo를 사용하면 chat이 추가될 때에 한번만 console에 찍힌다.
export default React.memo(Chat, areEqual);
// export default Chat;
