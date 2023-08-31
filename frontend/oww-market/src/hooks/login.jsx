import React, { useEffect, useState } from 'react';
import apiRequest from '../utils/api';
import {DotLoader} from 'react-spinners';
import LoadingScreen from '../components/loading';
import axios from 'axios';
const Login = () => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    // Function to extract token from query parameters
    const getTokenFromQueryParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      return token;
    };

    // Get the token from query parameters
    const token = getTokenFromQueryParams();

    // If token exists, save it to local storage or use it as needed
    if (token) {
      localStorage.setItem('token', token);
      
        // Example API request
        apiRequest('http://localhost:3000/auth/google/success')
          .then(async (response) => {
            console.log(response.data);
            if (response.data.success === true) {
              const profile = await axios.get(`http://localhost:3000/profile/of/${response.data.user._id}`);
              console.log(profile.data.profile)
              if(profile.data.success === false) {
                window.location.href = "/";
              }
              localStorage.setItem("user", JSON.stringify(response.data.user));
              localStorage.setItem("profile", JSON.stringify(profile.data.profile));
              setloading(false)
              window.location.href = "/user/dashboard";
            }
          })
          .catch((error) => {
            console.error(error);
          });
      
    } else {
        window.location.href = "/login?error=gmailerror"
    }
  }, []);

  // Your login component UI goes here
  return <>
    {loading && <LoadingScreen text={'loading'}/>}
  </>
}

export default Login;