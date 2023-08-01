import React, { useEffect } from 'react';
import axios from 'axios';

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

  return <div>Logging out...</div>;
}

export default Logout;
