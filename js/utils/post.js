import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

// to use fromNow function
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update title, description, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);

  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;

  // const descriptionElement = liElement.querySelector('[data-id="description"]');
  // if (descriptionElement) descriptionElement.textContent = post.description;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;

  // calculate timestamp
  // console.log(dayjs(post.createdAt).fromNow());
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.createdAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'http://via.placeholder.com/1368x400';
    });
  }

  // attach events
  // go to post detail when click on div.post-item
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      // C1 : if event is triggered from menu -> ignore
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(e.target)) {
        console.log('parent ignore click');
        return;
      }

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // C2 : prevent event bubbling to parent
      // e.stopPropagation();
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  // add click event for remove button
  const removeButton = liElement.querySelector('[data-id="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', () =>{
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post
      })

      removeButton.dispatchEvent(customEvent);
    })
  }

  return liElement;
}

export function renderPostList(postList) {
  // if (!Array.isArray(postList) || postList.length === 0) return;
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  // clear current post list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
