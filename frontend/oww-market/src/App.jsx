import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./functions/login";
import Logout from "./functions/logout";
import Home from "./pages/home";
import LandingPage from "./pages/LandingPage";
import LoginComponent from "./components/Login";
import SignUpComponent from "./components/SignUp";
import profileImage from '../src/assets/images/twitter-icon.png'
import Dashboard from "./components/Dashboard";
import Analytics from "./pages/analytics";
import Shops from "./pages/shops";
import Profile from "./components/ProfileTop";


const fakeProfile = {
  name: "John Doe",
  email: "john@gmail.com", 
  bio: "I am a software engineer and I love to code and build things. Oh and I love to play video games too!",
  image: profileImage
}

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />;
        <Route path="/signup" element={<SignUpComponent/>} />
        <Route path="/login" element={<LoginComponent/>} />
        <Route path="/login/callback" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path = "/profile" element={<Profile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path = '/anaytics' element={<Analytics/>} />
        <Route path="/shops" element = {<Shops/>} />

      </Routes>
    </>
  )
}
export default App;
