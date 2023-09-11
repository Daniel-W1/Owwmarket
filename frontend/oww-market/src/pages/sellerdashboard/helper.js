import axios from "axios";
import apiRequest from "../../utils/api";

var request = () => apiRequest('http://localhost:3000/auth/check/token')
.then(async (response) => {
  try {
    if (response.data.success === true) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const profile = await axios.get(`http://localhost:3000/profile/of/${response.data.user._id}`);
      localStorage.setItem("profile", JSON.stringify(profile.data.profile));
            return true;
    } else {
            return false;
    }
  } catch (error) {
    console.error("Error in promise chain:", error);
  }
});




export default request;
