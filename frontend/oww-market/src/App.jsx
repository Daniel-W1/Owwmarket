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
        <Route path = "/profile" element={<Profile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path = '/anaytics' element={<Analytics/>} />
        <Route path="/shops" element = {<Shops/>} />
        <Route path="/shops/single" element = {<ShopCard name={name} shop={fakeShop}/>} />

      </Routes>
    </>
  )
}
export default App;
