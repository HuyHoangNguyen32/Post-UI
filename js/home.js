import postApi from './api/postApi';
import { getUlPagination, setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

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

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
  if (!pagination || !ulPagination) return;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/disable prev/next links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev');

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next');

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = getUlPagination();
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

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // set default values from query params
  // title_like
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 1000);

  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    // attach click event for links
    initPagination();

    // set default pagination (_page, _limit) on URL
    initUrl();

    //
    initSearch();

    // ! I don't understand this
    // render post list based URL params
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
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
