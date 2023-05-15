import axiosClient from './axiosClient';

// import : default import, named import
// export : default import, named import
// default : can use your name --> have one default export ONLY
// name export : use exactly name --> have multiple exports

export function getAllCities(params) {
  const url = '/cities';
  return axiosClient.get(url, { params });
}

export function getCityById(id) {
  const url = `/cities/${id}`;
  return axiosClient.get(url);
}

//   add(data) {
//     const url = '/cities';
//     return axiosClient.post(url, data);
//   },

//   update(data) {
//     const url = `/cities/${data.id}`;
//     return axiosClient.patch(url, data);
//   },

//   // Config headers
//   updateFormData(data) {
//     const url = `/cities/${data.id}`;
//     return axiosClient.patch(url, data, {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   },

//   remove(id) {
//     const url = `/cities/${id}`;
//     return axiosClient.delete(url);
//   },
