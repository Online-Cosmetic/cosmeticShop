import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./styles/index.css";

// index.jsx에서는 별도의 전역 설정 인스턴스를 import할 필요 없이
// 각 컴포넌트에서 customAxios를 import하여 사용하도록 합니다.
createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);