import React, { useState } from "react";

const App = () => {
	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");
	const [nickName, setNickName] = useState("");
	const [isAgreeInfo, setIsAgreeInfo] = useState(false);
	const [signupPath, setSignupPath] = useState("");
	const [sex, setSex] = useState("male");

	// 이메일 설정 (input text)
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};

	// 패스워드 설정 (input password)
	const onPwChange = (e) => {
		setPw(e.target.value);
	};

	// 정보 이용 동의 설정 (checkbox)
	const updateIsAgreeInfo = (e) => {
		// setIsAgreeInfo(!isAgreeInfo);
		setIsAgreeInfo((prev) => !prev);
	};

	// 가입 경로 설정 (select)
	const onSignupPathChange = (e) => {
		setSignupPath(e.target.value);
	};

	// 성별 설정 (radio)
	const onSexChange = (e) => {
		setSex(e.target.value);
	};

	const onNickNameChange = (e) => {
		setNickName(e.target.value);
	};

	// 정보 제출
	const submit = () => {
		const payload = {
			email: email,
			pw: pw,
			nickName: nickName,
			isAgreeInfo: isAgreeInfo,
			signupPath: signupPath,
			sex: sex,
		};
		/* 
      업그레이드 문제
      1. 패스워드가 6자 이하인 경우는 통과하지 않도록
        - pw의 length를 이용하여 검사
      2. 일반적으로 이메일 형식 ~~@~~ 가 아니면 제출을 막기.
        - 자바스크립트의 정규 표현식을 사용
      3. 필드가 증가할 때마다, state의 개수도, onChange의 종류도 계속 늘어나는 것을 어떻게 하면 효율적으로 할 수 있을까?
        - 하나의 object로 만든다. 여기에는 구현이 안되어 있음.
      4. html 양이 계속 늘어나는데, 효율적으로 할 수는 없을까?
        - 이 문제는 이해를 못했습니다.
    */

		// 이메일 정규 표현식
		const reg_email =
			/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		if (pw.length < 6) {
			alert("패스워드는 7자 이상 입력해주세요.");
		} else if (!reg_email.test(email)) {
			alert("이메일은 ~@~ 형식을 맞춰주세요!");
		} else {
			alert("제출 완료");
			console.log(payload);
		}
	};
	return (
		// 모든 항목 변수 선언 version
		<div>
			<h1>회원가입입니다.</h1>
			<div>
				<span>아이디 : </span>
				<input
					value={email}
					onChange={(e) => onEmailChange(e)}
					placeholder="이메일을 입력하세요"
				/>
			</div>
			<div>
				<span>패스워드 : </span>
				<input
					value={pw}
					type="password"
					onChange={(e) => onPwChange(e)}
					placeholder="비밀번호를 입력하세요"
				/>
			</div>
			<div>
				<span>닉네임 : </span>
				<input
					value={nickName}
					onChange={(e) => onNickNameChange(e)}
					placeholder="닉네임을 입력하세요"
				/>
			</div>
			<div>
				<span>정보 수집 동의 : </span>
				<input
					checked={isAgreeInfo}
					type="checkbox"
					onClick={(e) => updateIsAgreeInfo()}
				/>
			</div>
			<div>
				<span>가입 경로 : </span>
				<select value={signupPath} onChange={(e) => onSignupPathChange(e)}>
					<option value={"search"}>검색</option>
					<option value={"ads"}>광고</option>
					<option value={"etc"}>야외</option>
				</select>
			</div>

			<div>
				<span>성별 : </span>
				<span>남 </span>
				<input
					type="radio"
					value="male"
					checked={sex === "male"}
					onClick={(e) => onSexChange(e)}
				/>
				<span>여 </span>
				<input
					type="radio"
					value="female"
					checked={sex === "female"}
					onClick={(e) => onSexChange(e)}
				/>
			</div>
			<button onClick={submit}>제출</button>
		</div>
	);
};

export default App;
