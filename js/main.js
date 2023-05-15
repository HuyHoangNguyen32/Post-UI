import axiosClient from './api/axiosClient';
import axios from 'axios';
import postApi from './api/postApi';

console.log('hello from main.js');

async function main() {
  // const response = await axiosClient.get('/posts'); // https://js-post-api.herokuapp.com/api/posts
  // const response = await axios.get('/posts'); // http://localhost:5173/posts

  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    const data = await postApi.getAll(queryParams);
    console.log(data);
  } catch (error) {}

  await postApi.updateFormData({
    id: 'lea11ziflg8xoixq',
    title: 'Nihil expedita eveniet 0515',
  });
}

main();
