import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import { AppProvider } from "./app/store";
import { SignUp, VerifyEmail, Login, ForgotPassword } from "./app/auth";
import { Subscribe, PaymentSuccess } from "./app/subscribe";
import { Dashboard } from "./app/dashboard";
import { Admin } from "./app/admin";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  </AppProvider>
);
