import reducers from "../reducers";
import { applyMiddleware, createStore } from "redux";
// Redux의 상태 추적을 브라우저에서 할 수 있게 해주는 확장모듈
import { composeWithDevTools } from "redux-devtools-extension";
// 새로고침해도 state가 유지되도록 redux-persist를 사용.
import { persistStore, persistReducer } from "redux-persist";
// 로컬 스토리지를 불러온다.
import storage from "redux-persist/lib/storage";

// persist를 적용하기 위한 설정
const persistConfig = {
	key: "root", // reducer 객체에서 데이터를 저장하는 지점 설정
	storage, // 로컬 스토리지 사용
};

// 위에 정의한 config 대로 persist를 적용한 reducer를 생성.
const enhancedReducer = persistReducer(persistConfig, reducers);

// store와 persistor를 리턴하는 함수를 export한다.
export default function configureStore() {
	const store = createStore(enhancedReducer, {}, composeWithDevTools());
	const persistor = persistStore(store);
	return { store, persistor };
}
