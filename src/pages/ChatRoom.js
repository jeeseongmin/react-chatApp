import { useParams, useHistory } from "react-router-dom";

const ChatRoom = () => {
	const { roomId } = useParams();
	const history = useHistory();
	//...
	return (
		<div>
			<h1>해당 Room 번호는 : {roomId} 입니다.</h1>
		</div>
	);
};

export default ChatRoom;
