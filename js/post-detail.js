import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow function
dayjs.extend(relativeTime);

function renderPostDetail(post) {
  if (!post) return;

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updateAt).format('- DD/MM/YY'));

  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl} 555")`;

    // TODO: Fix this
    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage = 'url("https://picsum.photos/id/1/1368x400")';
    });
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.textContent = 'Edit Page';
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
  }
}

(async () => {
  registerLightbox();
  // get post id from URL
  // fetch post detail API
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }
    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
