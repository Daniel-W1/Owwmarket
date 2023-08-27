import React, { useEffect, useState } from 'react';
import apiRequest from '../utils/api';
import {DotLoader} from 'react-spinners';
import LoadingScreen from '../components/loading';

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
          .then((response) => {
            console.log(response.data);
            if (response.data.success === true) {
              localStorage.setItem("user", JSON.stringify(response.data.user));
              setloading(false)
              window.location.href = "/dashboard";
            }
          })
          .catch((error) => {
            console.error(error);
          });
      
    }
  }, []);

  // Your login component UI goes here
  return <>
    {loading && <LoadingScreen text={'loading'}/>}
  </>
}

export default Login;


