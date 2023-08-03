import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./functions/login";
import Logout from "./functions/logout";
import Home from "./pages/home";
import LandingPage from "./pages/LandingPage";
import LoginComponent from "./components/Login";
import SignUpComponent from "./components/SignUp";

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />;
        <Route path="/signup" element={<SignUpComponent/>} />
        <Route path="/login" element={<LoginComponent/>} />
        <Route path="/login/callback" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </>
  )
}
export default App;
