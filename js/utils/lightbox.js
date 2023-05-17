export function registerLightbox() {
  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // img with data-album
    let imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    const index = [...imgList].findIndex((x) => x === target);
    console.log('album image click', { target,index, imgList });
  });
}
