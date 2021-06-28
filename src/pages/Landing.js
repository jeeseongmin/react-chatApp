import React from "react";
import { Link, useHistory } from "react-router-dom";

const Landing = () => {
	const history = useHistory();
	return (
		<div>
			<div
				onClick={(e: any) => {
					history.push("/user/login");
				}}
			>
				Go to Login
			</div>
		</div>
	);
};

export default Landing;
