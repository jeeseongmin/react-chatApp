import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJwtToken } from "../reducers/user";
import { Link, useHistory } from "react-router-dom";
import { firebaseApp } from "../firebase";

const Home = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const jwtToken = useSelector((state: any) => state.user.jwtToken);

	// 랜덤한 Token을 저장하기 위한 함수
	const updateJwtToken = () => {
		const makeid = (length: number) => {
			var result = "";
			var characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var charactersLength = characters.length;
			for (var i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		};
		// Action을 dispatch해서 Reducer를 통해 Redux Store를 업데이트
		dispatch(setJwtToken(makeid(5)));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("hi1");
		const [email, password] = e.target.elements;
		console.log(email.value);
		console.log(password.value);
		firebaseApp
			.auth()
			.signInWithEmailAndPassword(email.value, password.value)
			.then((user) => {
				const uid = (firebaseApp.auth().currentUser || {}).uid;
				if (uid) {
					alert("로그인되었습니다.");
					history.push("/chatList");
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
		<div>
			<h1>메인 페이지입니다.</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<input type="email" placeholder="email" />
				</div>
				<div>
					<input type="password" placeholder="password" />
				</div>
				<div>
					<button type="submit">Login</button>
				</div>
			</form>
			<Link to="/users/signIn">SignIn</Link>
		</div>
	);
};

export default Home;
