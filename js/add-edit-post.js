import postApi from './api/postApi';
import { initPostForm } from './utils';

async function handlePostFormSubmit(formValues) {
  // console.log('submit from parent', formValues);
  try {
    // check add/edit mode
    // S1 : based on search params
    // S2 : check id in formValues
    // call API

    // let savedPost = null;
    // if (formValues.id) {
    //   savedPost = await postApi.update(formValues);
    // } else {
    //   savedPost = await postApi.add(formValues);
    // }

    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    // show success message
    // redirect to detail page
    // console.log('redirect to', savedPost.id);
    window.location.assign(`/post-detail.html?id=${savedPost.id}`);
  } catch (error) {
    console.log('failed to save post', error);
  }
}

/* ####################################
              ! MAIN
#################################### */
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
      onSubmit: handlePostFormSubmit,
    });

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
