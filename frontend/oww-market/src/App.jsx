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


const fakeProfile = {
  name: "John Doe",
  email: "john@gmail.com", 
  bio: "I am a software engineer and I love to code and build things. Oh and I love to play video games too!",
  image: profileImage,
  location: "Lagos, Nigeria",
  shops: [
    {
      name: "John's Shop",
      products: [
        {
          name: "Shoe",
          price: 1000,
          description: "This is a very nice shoe",
          image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
        },
        {
          name: "Shirt",
          price: 500,
          description: "This is a very nice shirt",
          image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
        },
      ]
    }
  ]
  ,
  followers: [
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },]
    ,
  following: [
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },],
  products: [
    {
      name: "Shoe",
      price: 1000,
      description: "This is a very nice shoe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
  ]


          

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
        <Route path = "/profile" element={<Profile profile={fakeProfile}/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path = '/anaytics' element={<Analytics/>} />
        <Route path="/shops" element = {<Shops/>} />

      </Routes>
    </>
  )
}
export default App;
