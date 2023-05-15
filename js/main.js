import axiosClient from './api/axiosClient';
import axios from 'axios';
import postApi from './api/postApi';

console.log('hello from main.js');

async function main() {
  // const response = await axiosClient.get('/posts'); // https://js-post-api.herokuapp.com/api/posts
  // const response = await axios.get('/posts'); // http://localhost:5173/posts
  const queryParams = {
    _page: 1,
    _limit: 5,
  };
  const response = await postApi.getAll(queryParams);
  console.log(response);
}

main();
