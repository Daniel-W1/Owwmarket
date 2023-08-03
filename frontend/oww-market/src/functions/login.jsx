import React, { useEffect } from 'react';
import apiRequest from '../utils/api';
import {DotLoader} from 'react-spinners';

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
  <div className='w-full h-screen flex justify-center items-center'> 
    <DotLoader
      css={{display: 'block', margin: '0 auto'}}
      size={150}
      color={"#123abc"}
      loading={true}
    />
   </div>
  );
}

export default Login;


