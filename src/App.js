import React, { useState } from "react";

const App = () => {
	const [person, setPerson] = useState({
		email: "",
		password: "",
		nickName: "",
		isAgreeInfo: false,
		signupPath: "",
		sex: "male",
	});

	const onInfoChange = (e, key) => {
		const cp = { ...person };
		cp[key] = e.target.value;
		setPerson(cp);
	};

	// 정보 제출
	const submit = () => {
		/* 
      업그레이드 문제
      1. 패스워드가 6자 이하인 경우는 통과하지 않도록
        - pw의 length를 이용하여 검사
      2. 일반적으로 이메일 형식 ~~@~~ 가 아니면 제출을 막기.
        - 자바스크립트의 정규 표현식을 사용
      3. 필드가 증가할 때마다, state의 개수도, onChange의 종류도 계속 늘어나는 것을 어떻게 하면 효율적으로 할 수 있을까?
        - 여러개의 state를 하나의 object안에 포함되도록 만든다. 그리고 onChange도 해당 object를 관리하는 함수를 만든다.
        - 그렇게 되면 onChange 시에 이전 항목을 상속받는 { ...person } 을 사용하면서 
        { ...person, email: e.target.value }와 같은 형식으로 만들게 되면 된다.
        해당 
      4. html 양이 계속 늘어나는데, 효율적으로 할 수는 없을까?
        - 이 문제는 이해를 못했습니다.
    */

		// 이메일 정규 표현식
		const reg_email =
			/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		if (!reg_email.test(person.email)) {
			alert("이메일은 ~@~ 형식을 맞춰주세요!");
		} else if (person.password.length < 6) {
			alert("패스워드는 7자 이상 입력해주세요.");
		} else {
			alert("제출 완료");
			console.log(person);
		}
	};

	return (
		// 모든 정보를 하나의 person obejct version
		<div>
			<h1>회원가입입니다.</h1>
			<div>
				<span>아이디 : </span>
				<input
					value={person.email}
					onChange={(e) => onInfoChange(e, "email")}
					placeholder="이메일을 입력하세요"
				/>
			</div>
			<div>
				<span>패스워드 : </span>
				<input
					value={person.password}
					type="password"
					onChange={(e) => onInfoChange(e, "password")}
					placeholder="비밀번호를 입력하세요"
				/>
			</div>
			<div>
				<span>닉네임 : </span>
				<input
					value={person.nickName}
					onChange={(e) => onInfoChange(e, "nickName")}
					placeholder="닉네임을 입력하세요"
				/>
			</div>
			<div>
				<span>정보 수집 동의 : </span>
				<input
					checked={person.isAgreeInfo}
					type="checkbox"
					onChange={(e) => onInfoChange(e, "isAgreeInfo")}
				/>
			</div>
			<div>
				<span>가입 경로 : </span>
				<select
					value={person.signupPath}
					onChange={(e) => onInfoChange(e, "signupPath")}
				>
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
					checked={person.sex === "male"}
					onClick={(e) => onInfoChange(e, "sex")}
				/>
				<span>여 </span>
				<input
					type="radio"
					value="female"
					checked={person.sex === "female"}
					onClick={(e) => onInfoChange(e, "sex")}
				/>
			</div>
			<button onClick={submit}>제출</button>
		</div>
	);
};

export default App;
