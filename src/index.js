import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./components/App";
import "todomvc-app-css/index.css";
import "./index.css";

store.subscribe(() => {
  console.log('store',store.getState());
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
