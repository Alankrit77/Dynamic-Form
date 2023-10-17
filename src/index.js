import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "notistack";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SnackbarProvider>
);

reportWebVitals();
