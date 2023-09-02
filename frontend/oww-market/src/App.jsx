import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./hooks/login";
import Logout from "./hooks/logout";
import LandingPage from "./pages/LandingPage";
import profileImage from '../src/assets/images/twitter-icon.png'
import Analytics from "./pages/analytics";
import Shops from "./pages/shops";
import Profile from "./components/ProfileTop";
import SignUpComponent from "./pages/SignUp";
import LoginComponent from "./pages/Login";
import ShopCard from "./components/ShopCard";
import Settings from "./pages/settings";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile/of/:userId" element={
          <div className="flex">
            <div className="float-left h-screen">
              <Sidebar />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll py-8 px-2 float-right flex-1 h-screen">
              <Profile />
            </div>
          </div>
        } />
        <Route path='/user/:userId/analytics' element={
          <div className="flex">
            <div className="float-left h-screen">
              <Sidebar />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll py-8 px-2 float-right flex-1 h-screen">
              <Analytics />
            </div>
          </div>
        } />
        <Route path="/shops/by/:userId" element={
          <div className="flex">
            <div className="float-left h-screen">
              <Sidebar />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll py-8 px-2 float-right flex-1 h-screen">
              <Shops />
            </div>
          </div>
        } />
        <Route path="/user/:userId/shops/:shopId" element={<ShopCard />} />
        <Route path="/user/:userId/settings" element={
          <div className="flex">
            <div className="float-left h-screen">
              <Sidebar />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll py-8 px-2 float-right flex-1 h-screen">
              <Settings />
            </div>
          </div>
        } />
        <Route exact path="/" element={<LandingPage />} />;
        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/login/callback" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
