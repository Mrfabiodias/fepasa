import { getAStations } from './model.js';
import { getBStations, BStations } from './model.js';
import { simulator } from './controller.js';

let selectedDepartureStation = null;
let selectedArrivalStation = null;

const initialPage = document.getElementById('initial_page');
const resultsPage = document.getElementById('results_page');

// Function to populate dropdown options
export function populateDropdown(selectElement, stations) {
  stations.sort();
  stations.forEach(function (station) {
    const option = document.createElement('option');
    option.value = station;
    option.text = station;
    selectElement.appendChild(option);
  });
  // console.log(selectElement);
}

// Hide home-page content:
export function hideElement(element) {
  element[0].classList.add('hidden');
}

// Toggle page content (switch from home, initial page to train results page)
export function togglePages(element, element2) {
  element.classList.add('hidden');
  element2.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function () {
  const departureStationSelect = document.getElementById(
    'departureStationSelect'
  );
});

const arrivalStationSelect = document.getElementById('arrivalStationSelect');
const submitButton = document.getElementById('submitButton');
let destStations = [];

// Listen for changes in the departure dropdown
departureStationSelect.addEventListener('change', function () {
  selectedDepartureStation = departureStationSelect.value;

  // Empty destination dropdown options (leaving only the first option - "Destino"):
  arrivalStationSelect.options.length = 1;
  // Forcing the default option "Destino" to be shown before the user clicks on the Destination station dropdown:
  arrivalStationSelect.options[0].selected = true;

  // Populate departure dropdown only with the stations that can be reached with a direct train:
  getBStations(function () {
    populateDropdown(arrivalStationSelect, BStations);
    console.log(BStations);
  });

  // Empty destination stations array for the next user search:
});

// Pictures sliders
export const initializeSlider = function () {
  document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('#slider');

    const slides = document.querySelectorAll('.slide');
    // let current = slides[0];

    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
    );

    moveToNextSlide(slides);
  });
};

////////////////////////
// Sticky banner navigation
const sliderSection = document.getElementById('slider');

export const banner = document.querySelector('.banner');

// && resultsPage.style.display === 'none'
const stickyBanner = function (entries) {
  const [entry] = entries;
  // if (!entry.isIntersecting && initialPage.style.display === 'none')
  if (!entry.isIntersecting && !initialPage.classList.contains('hidden'))
    banner.classList.add('sticky-banner');
  else banner.classList.remove('sticky-banner');
};

const bannerObserver = new IntersectionObserver(stickyBanner, {
  root: null,
  threshold: 0.5,
});

bannerObserver.observe(sliderSection);

//////////////////
// Sticky window-menu navigation

const stickyMenu = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting && !initialPage.classList.contains('hidden'))
    menuWindow.classList.add('sticky-window-menu');
  else menuWindow.classList.remove('sticky-window-menu');
};

const menuObserver = new IntersectionObserver(stickyMenu, {
  root: null,
  threshold: 0.5,
});

menuObserver.observe(sliderSection);

// Sticky lang-menu navigation

const stickyLangMenu = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting && !initialPage.classList.contains('hidden'))
    langMenuWindow.classList.add('sticky-lang-menu');
  else langMenuWindow.classList.remove('sticky-lang-menu');
};

const LangMenuObserver = new IntersectionObserver(stickyLangMenu, {
  root: null,
  threshold: 0.5,
});

LangMenuObserver.observe(sliderSection);

/////////////////////////
// Slider application:

const moveToNextSlide = function (slides) {
  let currentSlide = 0;

  const nextSlide = function () {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    slides.forEach((slide, i) => {
      slide.classList.remove('toggled');
      slide.classList.remove('active');
      slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });

    slides[currentSlide].classList.add('active');
  };

  setInterval(() => {
    nextSlide();
    // console.log('jumped to the next slide');
  }, 5000);
};

///////////

// The Menu button

const menu = document.getElementById('menu');
const menuWindow = document.querySelector('.window-menu');

// Display the menu window:

const displayMenu = function () {
  console.log('display menu button clicked');
  if (menuWindow.classList.contains('hidden')) {
    menuWindow.classList.remove('hidden');
  } else {
    menuWindow.classList.add('hidden');
  }
};

menu.addEventListener('click', displayMenu);
menuWindow.addEventListener('mouseleave', () => {
  if (!menuWindow.classList.contains('hidden')) displayMenu();
});
menuWindow.addEventListener('click', displayMenu);

// The Language Menu button

const langMenu = document.getElementById('menuLang');
const langMenuWindow = document.querySelector('.lang-menu');

const displayLangMenu = function () {
  console.log('display LANG menu button clicked');
  langMenuWindow.classList.toggle('hidden');
};

langMenu.addEventListener('click', displayLangMenu);
langMenuWindow.addEventListener('mouseleave', () => {
  if (!langMenuWindow.classList.contains('hidden')) displayLangMenu();
});
langMenuWindow.addEventListener('click', displayLangMenu);

////////////
// Resetting the Home Page status before navigating back from the resultsPage:

const resetToHomePage = function () {
  togglePages(resultsPage, initialPage);
  simulator.style.display = 'block';
  departureStationSelect.value = '';
  arrivalStationSelect.value = '';
};

////////////
// Page Navigation (with event delegation):
document.querySelector('.window-menu').addEventListener('click', function (e) {
  e.preventDefault();

  if (initialPage.classList.contains('hidden')) {
    resetToHomePage();
    console.log('page being toggled');
  }

  // Matching strategy
  if (e.target.classList.contains('menu-options')) {
    const id = e.target.getAttribute('href');
    if (
      id === '#simulator-container' &&
      !initialPage.classList.contains('hidden')
    ) {
      scrollToTop();
    } else {
      document
        .querySelector(id)
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

///////////////
// Scrolling to the top of the page:

const scrollToTop = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Smooth scrolling animation
  });
};
