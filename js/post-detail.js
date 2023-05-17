import postApi from './api/postApi';
import { setTextContent } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow function
dayjs.extend(relativeTime);

function renderPostDetail(post) {
  if (!post) return;
  // render title
  // render description
  // render author
  // render updateAt

  // author: 'Kurtis McLaughlin';
  // createdAt: 1681016264413;
  // description: 'et distinctio unde non sed tempore totam autem nihil dolorem officia quisquam perspiciatis voluptatibus doloribus dolores et dolorem sit accusantium inventore dolores asperiores dolorem amet alias voluptatibus voluptas occaecati hic error illum doloribus eius voluptatem possimus sint nemo eum dignissimos est ut id est natus sunt autem quidem hic et';
  // id: 'lea11ziflg8xoixq';
  // imageUrl: 'https://picsum.photos/id/200/1368/400';
  // title: 'Nihil expedita eveniet';
  // updatedAt: 1681016264413;
  console.log(post.title);
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updateAt).format('- DD/MM/YY'));

  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    console.log('hero image');

    // TODO: Fix this
    heroImage.addEventListener('error', () => {
      thumbnailElement.src = 'http://via.placeholder.com/1368x400';
    });
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.textContent = 'Edit Page';
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
  }
}

(async () => {
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
    console.log('post detail', post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
