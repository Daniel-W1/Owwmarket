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
import PostCard from "./components/PostCard";
import FeedSidebar from "./components/FeedSidebar";
import Feed from "./pages/feed";
import FeedHeader from "./components/FeedHeader";
import ShopDetails from "./components/ShopDetails";
import ProductPage from "./components/ProductPage";
// Seller Dashboard
import Page from "./pages/sellerdashboard/page";
import Payment from "./pages/Checkout";

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
        <Route path="/shops/by/:userId/create" element={
          <div className="flex">
            <div className="float-left h-screen">
              <Sidebar />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll py-8 px-2 float-right flex-1 h-screen">
              <Shops type="create"/>
            </div>
          </div>
        } />
        <Route path="/shops/:shopId" element={<ShopDetails />} />
        <Route path="/shops/:shopId/products/:productId" element={
          <div className="max-w-7xl mx-auto p-8">
            <ProductPage/>
          </div>
      }/>
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
        <Route path = '/feed' element = {
          <>
            <FeedHeader />
            <Feed />
          </>
        }/>
        <Route path="/dashboard" element={ <Page /> } />
        <Route path="/subscribe" element={ <Payment /> } />
        <Route path="/subscribe/success" element={ <Payment /> } />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
