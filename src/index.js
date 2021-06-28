import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./Routes";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import configureStore from "./config/store";
const { store, persistor } = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Routes />
		</PersistGate>
	</Provider>,
	document.getElementById("root")
);

reportWebVitals();
