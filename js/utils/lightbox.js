function showModal(modalElement) {
  // make sure bootstrap script is loaded
  if (!window.bootstrap) return;

  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

// handel click for all imgs
// img click -> find all imgs with the same album / gallery
// determine index of selected img
// show modal with selected img
// handle prev / next click

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // check if this modal is registered or not
  if (Boolean(modalElement.dataset.registered)) return;

  // selectors
  const imageElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  // lightbox vars
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index, imgList) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log(currentIndex)

    // show image at index
    showImageAtIndex(currentIndex, imgList);
    // show modal
    showModal(modalElement);
  });

  /**
   * 0 % 3 = 0
   * 1 % 3 = 1
   * 2 % 3 = 2
   * 3 % 3 = 0
   * 4 % 3 = 1
   *
   *
   * 1 % 3 = 1
   * 0 % 3 = 0
   * (-1 + 3) % 3 = 2
   * (-2 + 3) % 3 = 1
   */

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    // console.log(currentIndex);
    showImageAtIndex(currentIndex, imgList);
  });

  nextButton.addEventListener('click', () => {
    // show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length;
    // console.log(currentIndex);
    showImageAtIndex(currentIndex, imgList);
  });

  modalElement.dataset.registered = 'true';
}
