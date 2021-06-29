export const SET_JWT_TOKEN = "SET_JWT_TOKEN";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const SECOND_SAGA = "SECOND_SAGA";
export const SET_EMAIL = "SET_EMAIL";
export const SET_PASSWORD = "SET_PASSWORD";

export const setJwtToken = (jwtToken) => ({
	type: SET_JWT_TOKEN,
	payload: jwtToken,
});

export const setUserProfile = (userProfile) => ({
	type: SET_USER_PROFILE,
	payload: userProfile,
});

export const setEmail = (email) => ({
	type: SET_EMAIL,
	payload: email,
});

export const setPassword = (password) => ({
	type: SET_PASSWORD,
	payload: password,
});

const initialState = {
	jwtToken: null,
	userProfile: null,
	message: "",
	email: "",
	password: "",
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case SET_JWT_TOKEN: {
			return {
				...state,
				jwtToken: action.payload,
			};
		}

		case SET_USER_PROFILE: {
			return {
				...state,
				userProfile: action.payload,
			};
		}

		case SECOND_SAGA: {
			return {
				...state,
				message: action.payload,
			};
		}

		case SET_EMAIL: {
			return {
				...state,
				email: action.payload,
			};
		}
		case SET_PASSWORD: {
			return {
				...state,
				password: action.payload,
			};
		}
		default:
			return state;
	}
};

export default user;
