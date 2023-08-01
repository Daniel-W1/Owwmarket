import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./functions/login";
import Logout from "./functions/logout";
import Home from "./pages/home";

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home/>} />;
        <Route path="/login/callback" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </>
  )
}
export default App;
