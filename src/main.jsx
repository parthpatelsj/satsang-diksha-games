import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Kiosk touch guards: long-press must not open a context menu, and pinch
// (iOS/embedded WebKit gesture events) must not zoom the whole screen.
document.addEventListener("contextmenu", (e) => e.preventDefault())
document.addEventListener("gesturestart", (e) => e.preventDefault())

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
