import React from "react";
import { Link, useHistory } from "react-router-dom";
import { db, firebaseApp } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

const SignUp = () => {
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = e.target.elements;
		try {
			await firebaseApp
				.auth()
				.createUserWithEmailAndPassword(email.value, password.value);
			const uid = (firebaseApp.auth().currentUser || {}).uid;
			if (uid) {
				db.collection("user").doc(uid).set({
					email: email.value,
					password: password.value,
					// google에서 정해준 uid로 user를 구분한다.
					uid: uid,
				});
				alert("회원가입되었습니다.");
				history.push("/");
			} else {
				alert("error");
			}
		} catch (error) {
			console.log(error);
			alert("이미 있는 계정입니다.");
		}
	};

	return (
		<div className="Wrapper">
			<div className="signUpWrapper">
				<h2>
					<b>Register</b>
				</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<input
							type="email"
							className="loginInput"
							name="email"
							placeholder="Email"
						/>
					</div>
					<div>
						<input
							type="password"
							className="loginInput"
							name="password"
							placeholder="Password"
						/>
					</div>
					<Button variant="warning" className="loginBtn" type="submit">
						가입하기
					</Button>
				</form>
				<div className="signupLinkWrapper">
					<Link to="/" className="signupLink">
						뒤로가기
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
