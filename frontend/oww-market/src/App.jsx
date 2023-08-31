import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./functions/login";
import Logout from "./functions/logout";
import LandingPage from "./pages/LandingPage";
import profileImage from '../src/assets/images/twitter-icon.png'
import Analytics from "./pages/analytics";
import Shops from "./pages/shops";
import Profile from "./components/ProfileTop";
import Dashboard from "./pages/Dashboard";
import SignUpComponent from "./pages/SignUp";
import LoginComponent from "./pages/Login";
import ShopCard from "./components/ShopCard";
import Settings from "./pages/settings";


const fakeShop = {
  name: "Shop 1",
  description: "This is a shop",
  image: profileImage,  
  products: [
    {
      name: "Product 1",
      description: "This is a product",
      price: 100,
      image: profileImage,
      initialItemCount: 100,
      itemsLeft: 50,
    },
    {
      name: "Product 2",
      description: "This is a product",
      price: 100,
      image: profileImage,
      initialItemCount: 100,
      itemsLeft: 50,
    },
    {
      name: "Product 3",
      description: "This is a product",
      price: 100,
      image: profileImage,
      initialItemCount: 100,
      itemsLeft: 0,
    },
  ]
}

const name = "John Doe"

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />;
        <Route path="/signup" element={<SignUpComponent/>} />
        <Route path="/login" element={<LoginComponent/>} />
        <Route path="/login/callback" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path = "/profile/of/:userId" element={<Profile/>} />
        <Route path="/user/dashboard" element={<Dashboard/>} />
        <Route path = '/user/:userId/anaytics' element={<Analytics/>} />
        <Route path="/shops/by/:userId" element = {<Shops/>} />
        <Route path="/user/:userId/shops/:shopId" element = {<ShopCard/>} />
        <Route path="/user/:userId/settings" element={<Settings/>} />

      </Routes>
    </>
  )
}
export default App;
