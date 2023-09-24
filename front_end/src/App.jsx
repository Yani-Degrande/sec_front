import Login from "./auth/login";
import TwoFactorAuth from "./auth/2fa";
import EmailForm from "./auth/changePassword/emailForm";
import PasswordForm from "./auth/changePassword/passwordForm";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/change-password" element={<EmailForm />} />
      <Route path="/reset-password" element={<PasswordForm />} />

      {/* Other routes */}
    </Routes>
  );
}

export default App;
