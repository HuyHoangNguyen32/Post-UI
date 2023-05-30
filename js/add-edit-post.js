/* ####################################
              ! MAIN
#################################### */

import postApi from './api/postApi';

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    // * Cách 2 : viết ngắn gọn
    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    // * Cách 1 : viết tường minh
    // let defaultValues = {
    // title: '',
    // description: '',
    // author: '',
    // imageUrl: '',
    // };

    // if (postId) {
    //   defaultValues = await postApi.getById(postId);
    // }

    console.log('postId', postId);
    console.log('mode', postId ? 'edit' : 'add');
    console.log('defaultValues', defaultValues);
  } catch (error) {
    console.log('failed to fetch post details:', error);
  }
})();
