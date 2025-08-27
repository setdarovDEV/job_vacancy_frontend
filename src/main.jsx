// ✅ TO'LIQ TUZATILGAN main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
<Toaster position="top-center" />


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="123075365235-6igllus9sranssc7hm2uv6jtqmfc9m8d.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
