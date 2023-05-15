import axiosClient from './api/axiosClient';
import axios from 'axios';

console.log('hello from main.js');

async function main() {
  const response = await axiosClient.get('/posts'); // https://js-post-api.herokuapp.com/api/posts
  // const response = await axios.get('/posts'); // http://localhost:5173/posts
  console.log(response);
}

main();
