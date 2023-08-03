import React, { useEffect } from 'react';
import axios from 'axios';
import { DotLoader } from 'react-spinners';

function Logout() {
  useEffect(() => {
    const logoutUser = async () => {
      const url = 'http://localhost:3000/auth/google/logout';

      try {
        const response = await axios.get(url, { withCredentials: true });

        if (response.data.success === true) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      } catch (error) {
        console.error(error);
      }
    };

    logoutUser();
  }, []);

  return <div className='flex justify-center items-center w-full h-screen'>
    <DotLoader
      css={{display: 'block', margin: '0 auto'}}
      size={150}
      color={"#123abc"}
      loading={true}
    />
  </div>;
}

export default Logout;
