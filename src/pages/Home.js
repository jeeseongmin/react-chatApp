import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJwtToken, setEmail, setPassword, setUuid } from "../reducers/user";
import { Link, useHistory } from "react-router-dom";
import { firebaseApp } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import "../chatting.css";
import main from "../image/main.png";

const Home = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		const [email, password] = e.target.elements;
		firebaseApp
			.auth()
			.signInWithEmailAndPassword(email.value, password.value)
			.then((user) => {
				const uid = (firebaseApp.auth().currentUser || {}).uid;
				if (uid) {
					alert("로그인되었습니다.");
					dispatch(setEmail(email.value));
					dispatch(setPassword(password.value));
					dispatch(setUuid(uid));
					history.push("/chat/list");
				} else {
					alert("error");
				}
			})
			.catch((error) => {
				alert("로그인 정보가 없습니다.");
				var errorCode = error.code;
				var errorMessage = error.message;
			});
	};

	return (
		<div className="Wrapper">
			<div className="loginWrapper">
				<h2>
					<b>Chat Chat Chat</b>
				</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<input
							type="email"
							className="loginInput"
							placeholder="이메일 아이디, 이메일, 전화번호"
						/>
					</div>
					<div>
						<input
							type="password"
							className="loginInput"
							placeholder="비밀번호"
						/>
					</div>
					<div>
						<Button variant="warning" className="loginBtn" type="submit">
							로그인
						</Button>
					</div>
				</form>
				<div className="signupLinkWrapper">
					<Link to="/users/signUp" className="signupLink">
						회원가입
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
