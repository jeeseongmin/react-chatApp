import { combineReducers } from "redux";
import user from "./user";
import chatroom from "./chatroom";

export const USER_LOGOUT = "USER_LOGOUT";
export const userLogOut = () => ({
	type: USER_LOGOUT,
});

const appReducer = combineReducers({
	user,
	chatroom,
});

const reducers = (state, action) => {
	if (action.type === USER_LOGOUT) {
		state = undefined;
	}
	return appReducer(state, action);
};

export default reducers;
