import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow function
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  // ! I don't understand this
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
    // console.log('test thumbnail');

    thumbnailElement.addEventListener('error', () => {
      // console.log('test error thumbnail');
      thumbnailElement.src = 'http://via.placeholder.com/1368x400';
    });
  }

  // attach events

  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render post list
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev');
}
function handleNextClick(e) {
  e.preventDefault();
  console.log('next');
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = document.getElementById('pagination');
  if (!ulPagination) return;

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick);
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}

function initUrl() {
  // ! I don't understand this
  const url = new URL(window.location);

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  // ! I don't understand this
  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();
    initUrl();

    // ! I don't understand this
    const queryParams = new URLSearchParams(window.location.search);
    // set default query params if not existed
    console.log(queryParams.toString());

    // const queryParams = {
    //   _page: 1,
    //   _limit: 6,
    // };
    const { data, pagination } = await postApi.getAll(queryParams);
    // console.log(data);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
