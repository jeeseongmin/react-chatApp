import React, { useState, useEffect } from "react";
import { db, firebaseApp, firebase } from "../firebase";
import { Badge } from "react-bootstrap";

const MyInvitationComp = (props) => {
	const id = props.id;
	const title = props.title;
	const type = props.type;
	const receiver = props.receiver;
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		let getUserInfo = async function () {
			if (type === 1) {
				let userRef = await db.collection("user").doc(id).get();
				const _user = userRef.data();
				setUserInfo(_user);
			} else {
				let userRef = await db.collection("user").doc(receiver).get();
				const _user = userRef.data();
				setUserInfo(_user);
			}
		};
		getUserInfo();
		console.log(userInfo);
	}, []);

	if (type === 1) {
		return (
			<div className="myInvitationComp">
				<div className="myInvitationImgWrapper">
					<img alt="guest" src={userInfo.imgUrl} className="invite_userimg" />
				</div>
				<div className="senderNameWrapper">
					<h5>
						<b>[{title}]</b>
					</h5>
					<h5>
						<b>{userInfo.nickName}님이 초대하셨습니다.</b>
					</h5>
				</div>
			</div>
		);
	} else {
		return (
			<div className="myInvitationComp myInvitationComp_room">
				<div className="myInvitationImgWrapper">
					<img alt="guest" src={userInfo.imgUrl} className="invite_userimg" />
				</div>
				<div className="senderNameWrapper">
					<h5>
						<b>
							{userInfo.nickName}({userInfo.email})
						</b>
					</h5>
				</div>
			</div>
		);
	}
};

export default MyInvitationComp;
