import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

new SimpleLightbox('#gallery a');

const API_KEY = '35894973-b1abdffa43a0657d683efc17a';
const API_URL = 'https://pixabay.com/api/';
const MAX_ITEMS = 40;

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.getElementById('gallery');

let searchTerm = '';
let currentPage = 1;
let totalPages = 0;

const clearGallery = () => {
  galleryEl.innerHTML = '';
};

const searchParams = () =>
  new URLSearchParams({
    key: API_KEY,
    q: searchTerm,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: MAX_ITEMS,
  });

const fetchImages = async () => {
  const response = await axios.get(`${API_URL}?${searchParams()}`);
  const data = response.data;
  if (data.totalHits === 0) {
    Notiflix.Notify.failure(`No results found for '${searchTerm}'`);
    return;
  }
  //declaration images, renderImages
  const images = data.hits;
  renderImages(images);

  if (currentPage === 1) {
    Notiflix.Notify.success(
      `Hooray! We found ${data.totalHits} images with that sentence: ${searchTerm}`
    );
  }

  const totalPages = Math.round(data.totalHits / MAX_ITEMS);
  setTimeout(() => {
    if (currentPage === totalPages) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  }, 2000);
  return images;
};

const renderImages = images => {
  images.forEach(image => {
    const imageCard = document.createElement('div');
    imageCard.classList.add('image-box');
    imageCard.innerHTML = `
          <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" />
          </a>
          <h3>${image.user}</h3>
          <p>Likes: ${image.likes} | Views: ${image.views} | Comments: ${image.comments} | Downloads: ${image.downloads}</p>
        `;
    galleryEl.append(imageCard);
  });
  new SimpleLightbox('#gallery a');
};

const makeGallery = e => {
  searchTerm = e.currentTarget.elements.searchQuery.value.trim();
  e.preventDefault();
  clearGallery();
  currentPage = 1;
  fetchImages();
};

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight) {
    currentPage++;
    fetchImages();
  }
};

searchFormEl.addEventListener('submit', makeGallery);
document.addEventListener('scroll', handleScroll);
