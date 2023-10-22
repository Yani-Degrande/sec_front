import Login from "./auth/login";
import TwoFactorAuth from "./auth/2fa";
import EmailForm from "./auth/changePassword/emailForm";
import PasswordForm from "./auth/changePassword/passwordForm";
import { Route, Routes } from "react-router-dom";

// ================== Pages ==================
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/auth/change-password/verify" element={<TwoFactorAuth />} />
      <Route path="/change-password" element={<EmailForm />} />
      <Route path="/reset-password" element={<PasswordForm />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Other routes */}
    </Routes>
  );
}

export default App;
