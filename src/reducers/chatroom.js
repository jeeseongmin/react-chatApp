export const SET_CHAT = "SET_CHAT";
export const SET_CHATROOM = "SET_CHATROOM";

export const setChatroom = (chatroom) => ({
	type: SET_CHATROOM,
	payload: chatroom,
});

// export const setChat = (chat) => ({
// 	type: SET_CHAT,
// 	payload: chat,
// });

const initialState = {};

const chatroom = (state = initialState, action) => {
	switch (action.type) {
		case SET_CHATROOM: {
			return {
				...state,
				jwtToken: action.payload,
			};
		}
		default:
			return state;
	}
};

export default chatroom;
