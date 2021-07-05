import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Link, useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import guest from "../image/guest.png";

const SignUp = () => {
	const history = useHistory();
	const [profile, setProfile] = useState(null);
	const [imgBase64, setImgBase64] = useState(guest); // 파일 base64
	const [imgFile, setImgFile] = useState(); //파일
	const [nickNameCheck, setNickNameCheck] = useState(false);

	const profileRef = useRef();
	const nickNameRef = useRef();
	const handleFileInput = function (e) {
		let reader = new FileReader();

		reader.onloadend = () => {
			const base64 = reader.result;
			if (base64) {
				setImgBase64(base64.toString());
			}
		};
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
			setImgFile(e.target.files[0]);
		}
		console.log(imgBase64);
		console.log(imgFile);
	};

	const fileInputClick = function () {
		profileRef.current.click();
	};

	const resetProfile = function () {
		setImgBase64(guest);
	};

	useEffect(() => {
		console.log(profile);
	}, [profile]);

	const isUnique = async function () {
		try {
			const userRef = await db.collection("user");
			const pass = await userRef
				.where("nickName", "==", nickNameRef.current.value)
				.get();
			if (pass.empty) {
				setNickNameCheck(true);
			} else {
				setNickNameCheck(false);
			}
		} catch (error) {
			alert("통화");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { email, password, passwordCheck, nickName } = e.target.elements;

		if (
			email.value === "" ||
			password.value === "" ||
			passwordCheck.value === "" ||
			nickName.value === ""
		) {
			alert("모든 정보를 입력해주세요.");
			return 0;
		} else if (password.value !== passwordCheck.value) {
			alert("비밀번호를 동일하게 입력해주세요.");
			return 0;
		} else if (!nickNameCheck) {
			alert("중복된 닉네임입니다.");
			return 0;
		} else if (!imgFile) {
			alert("이미지 파일이 없습니다!");
			return 0;
		} else {
			try {
				await firebaseApp
					.auth()
					.createUserWithEmailAndPassword(email.value, password.value);
				const uid = (firebaseApp.auth().currentUser || {}).uid;
				if (uid) {
					//firestore에 이미지 저장
					console.log(imgFile);
					var fileName =
						"profileImg_" + firebase.firestore.Timestamp.now().seconds;
					var storageRef = firebase.storage().ref();
					// Create a reference to 'images/mountains.jpg'
					var mountainImagesRef = storageRef.child("images/" + fileName);
					var file = imgFile;
					try {
						await mountainImagesRef.put(file);
						console.log("Upload a blob or file!");
					} catch (error) {
						console.log(error);
					}

					try {
						if (file) {
							const fullUrl = "images/" + fileName;
							var imgUrl = await storageRef.child(fullUrl).getDownloadURL();
						} else {
							const fullUrl = "/image/guest.png";
						}
					} catch (error) {
						console.log(error);
					}

					db.collection("user").doc(uid).set({
						email: email.value,
						password: password.value,
						// google에서 정해준 uid로 user를 구분한다.
						nickName: nickName.value,
						imgUrl: imgUrl,
						uid: uid,
					});
					db.collection("user")
						.doc(uid)
						.collection("invitation")
						.doc("type")
						.set({
							acceptRoom: [],
							rejectRoom: [],
							waitingRoom: [],
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
		}
	};

	return (
		<div className="Wrapper">
			<div className="signUpWrapper">
				<div className="signUpHedaer">
					<h2>
						<b>SignUp</b>
					</h2>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="signUpDiv signUpProfileWrapper">
						<div>
							<h4>profile</h4>
						</div>
						<div className="profilePreviewWrapper">
							<img
								alt="profilePreview"
								className="profilePreview"
								src={imgBase64}
							/>
						</div>
						<span>
							<input
								type="file"
								name="imgFile"
								id="imgFile"
								className="profileImg"
								ref={profileRef}
								onChange={(e) => handleFileInput(e)}
							/>
							<div className="profileUploadBtnWrapper">
								<Button
									variant="warning"
									className="profileUploadBtn"
									onClick={fileInputClick}
								>
									업로드
								</Button>
								<Button
									variant="light"
									className="profileUploadBtn"
									onClick={resetProfile}
								>
									초기화
								</Button>
							</div>
						</span>
					</div>
					<div className="signUpDiv">
						<input
							type="nickName"
							className="loginInput nickNameInput"
							name="nickName"
							ref={nickNameRef}
							onChange={isUnique}
							placeholder="NickName"
						/>
						<p
							className={
								nickNameCheck
									? "viewNickNameCheck isUnique"
									: "viewNickNameCheck"
							}
						>
							{nickNameCheck
								? "사용할 수 있는 닉네임입니다."
								: "공백이거나 중복된 닉네임이 존재합니다."}
						</p>
					</div>

					<div className="signUpDiv">
						<input
							type="email"
							className="loginInput"
							name="email"
							placeholder="Email"
						/>
					</div>
					<div className="signUpDiv">
						<input
							type="password"
							className="loginInput"
							name="password"
							placeholder="Password"
						/>
					</div>
					<div className="signUpDiv">
						<input
							type="password"
							className="loginInput"
							name="passwordCheck"
							placeholder="Password Check"
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
