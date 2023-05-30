/* ####################################
              ! MAIN
#################################### */

import postApi from './api/postApi';
import { initPostForm } from './utils';

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

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log('submit', formValues)
    })

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

    // console.log('postId', postId);
    // console.log('mode', postId ? 'edit' : 'add');
    // console.log('defaultValues', defaultValues);
  } catch (error) {
    console.log('failed to fetch post details:', error);
  }
})();
