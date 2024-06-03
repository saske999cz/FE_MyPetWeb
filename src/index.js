import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from './redux/store';
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { AuthProvider } from "./utils/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
