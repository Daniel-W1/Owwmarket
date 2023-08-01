import React, { useEffect } from 'react';
import apiRequest from '../utils/api';
function Login() {
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
              window.location.href = "/";
            }
          })
          .catch((error) => {
            console.error(error);
          });
      
    }
  }, []);

  // Your login component UI goes here
  return (
  <> 
    <h1>Until Login...</h1>
   </>
  );
}

export default Login;


