import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../chatting.css";
import { db } from "../firebase";
import likeImg from "../image/like.png";
import sleepImg from "../image/sleep.png";
import smileImg from "../image/smile.png";
import editImg from "../image/edit.png";
import deleteImg from "../image/delete.png";

const Chat = (props) => {
	const [hostName, setHostName] = useState();
	console.timeLog("render chat" + props.chat.uid);
	const chat = props.chat;
	const uuid = props.uid;

	const [toggleBox, setToggleBox] = useState(false);
	const [toggleMe, setToggleMe] = useState(false);

	const onMouseOver = () => {
		setToggleBox(true);
	};

	const onMouseOut = () => {
		setToggleBox(false);
	};

	console.log(chat.uidOfUser);

	useEffect(() => {
		let findHostName = async function (req, res) {
			let sender = await db.collection("user").doc(chat.uidOfUser).get();
			let senderRef = sender.data();
			let host = await senderRef.email.slice(0, senderRef.email.indexOf("@"));
			setHostName(host);
		};

		findHostName();
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
					<div className="additionBox" toggle>
						<div>
							<img src={likeImg} className="addImg" alt="like" />
						</div>
						<div>
							<img src={smileImg} className="addImg" alt="smile" />
						</div>
						<div>
							<img src={sleepImg} className="addImg" alt="sleep" />
						</div>
						<div>
							<img src={editImg} className="addImg" alt="edit" />
						</div>
						<div>
							<img src={deleteImg} className="addImg" alt="delete" />
						</div>
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
			<div
				className="chatBox otherChat"
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut}
			>
				{toggleBox && (
					<div className="additionBox" toggle>
						<div>
							<img src={likeImg} className="addImg" alt="like" />
						</div>
						<div>
							<img src={smileImg} className="addImg" alt="smile" />
						</div>
						<div>
							<img src={sleepImg} className="addImg" alt="sleep" />
						</div>
						<div>
							<img src={editImg} className="addImg" alt="edit" />
						</div>
						<div>
							<img src={deleteImg} className="addImg" alt="delete" />
						</div>
					</div>
				)}
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
