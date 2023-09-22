import Login from "./auth/login";
import TwoFactorAuth from "./auth/2fa";
import {  Route, Routes } from "react-router-dom";

function App() {
  return (

      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/2fa" element={<TwoFactorAuth/> } />

        {/* Other routes */}
      </Routes>
  );
}

export default App;
