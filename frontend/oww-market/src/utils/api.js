import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = (url, method = 'POST', data = {}) => {
  const token = getToken();
  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  return axios({
    url,
    method,
    headers,
    data,
  });
};

export default apiRequest;
