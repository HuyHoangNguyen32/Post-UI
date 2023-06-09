import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log('request interceptor', config);

    // Attach token to request if exists
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer + ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('response interceptor', response);
    // transform data for all responses
    return response.data;
  },
  function (error) {
    console.log('axiosClient - response error', error.response);
    if (!error.response) throw new Error('Network error.Please try again later.');

    // redirect to login if not login
    if (error.response.status === 401) {
      window.location.assign('/login.html');
      return;
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error); // ! C1
    throw new Error(error); // ! C2
  }
);

export default axiosClient;
