import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./functions/login";
import Logout from "./functions/logout";
import Home from "./pages/home";
import LandingPage from "./pages/LandingPage";
import LoginComponent from "./components/Login";
import SignUpComponent from "./components/SignUp";
// import ProfileTop from "./components/ProfileTop";
import profileImage from '../src/assets/images/twitter-icon.png'
import Dashboard from "./components/Dashboard";


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
        {/* <Route path = "/profile" element={<ProfileTop profile={fakeProfile}/>} /> */}
        <Route path="/home" element={<Dashboard/>} />
      </Routes>
    </>
  )
}
export default App;
