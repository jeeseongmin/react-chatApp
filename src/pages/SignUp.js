import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const SignUp = () => {
	const history = useHistory();
	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = e.target.elements;
		console.log(email.value);
		console.log(password.value);
		firebaseApp
			.auth()
			.createUserWithEmailAndPassword(email.value, password.value)
			.then((user) => {
				const uid = (firebaseApp.auth().currentUser || {}).uid;
				if (uid) {
					const uuid = uuidv4();
					db.collection("user").doc(email.value).set({
						email: email.value,
						password: password.value,
						uid: uuid,
					});
					alert("회원가입되었습니다.");
					history.push("/");
				} else {
					alert("error");
				}
			})
			.catch((error) => {
				// setLoading(false);
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(error);
			});
	};

	return (
		<div>
			<h1>회원가입 페이지입니다.</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email : </label>
					<input type="email" name="email" placeholder="Email" />
				</div>
				<div>
					<label>Password : </label>
					<input type="password" name="password" placeholder="Password" />
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default SignUp;
