import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../chatting.css";

const Chat = (props) => {
	console.timeLog("render chat" + props.chat.uid);
	const chat = props.chat;
	const uuid = props.uid;
	/* 카톡처럼 구현
	본인 것이면 우측에 놓기
	다른 사람 것이면 좌측에 놓기
	*/
	if (chat.uidOfUser === uuid) {
		return (
			<div className="chatBox myChat">
				<div className="">{chat.content}</div>
			</div>
		);
	} else if (chat.uidOfUser !== uuid) {
		return (
			<div className="chatBox otherChat">
				<div className=""></div>
				<div className="">{chat.content}</div>
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
