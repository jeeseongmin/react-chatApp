import React from "react";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../chatting.css";

import { useParams } from "react-router-dom";

const ChatList2 = () => {
	const { chatrooms } = useParams();
	const ChattingList = chatrooms.map((doc) => (
		<Card style={{ width: "18rem" }} className="cardComponent">
			<Card.Body>
				<Card.Title>{doc.title}</Card.Title>
				<div className="buttonWrapper">
					<Button variant="primary">입장</Button>
					<Button variant="danger">삭제</Button>
				</div>
			</Card.Body>
		</Card>
	));
	return <div>{ChattingList}</div>;
};

export default ChatList2;
