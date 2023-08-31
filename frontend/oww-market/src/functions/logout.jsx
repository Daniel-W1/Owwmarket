import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DotLoader } from 'react-spinners';
import LoadingScreen from '../components/loading';

function Logout() {
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const logoutUser = async () => {
      setloading(true)
      const url = 'http://localhost:3000/auth/google/logout';

      try {
        const response = await axios.get(url, { withCredentials: true });

        if (response.data.success === true) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          setloading(false);
          window.location.href = '/';
        }
      } catch (error) {
        console.error(error);
      }
    };

    logoutUser();
  }, []);

  return loading ? <LoadingScreen text={'loading..'}/>: <></>;
}

export default Logout;
