import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },

  // Config base URL
  // addToAwsS3(data) {
  //   const url = '/posts';
  //   return axiosClient.post(url, data, {
  //     baseURL: 'http://amazon.s3.com/sample-link'
  //   });
  // },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  // Config headers
  // updateFormData(data) {
  //   const url = `/posts/${data.id}`;
  //   return axiosClient.patch(url, data, {
  //     headers: { 'Content-Type': 'multipart/form-data'}
  //   });
  // },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
