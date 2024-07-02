import { getAStations, getBStations, resetTrainOptions } from './model.js';
import { AStations, trainCheck, trainOptions } from './model.js';
import {
  populateDropdown,
  hideElement,
  togglePages,
  initializeSlider,
  banner,
} from './view.js';
import { translations } from './translations.js';

//initializing the slide transition:
initializeSlider();

getAStations(function () {
  populateDropdown(departureStationSelect, AStations);
});

let stationA = null;
let BStations = [];
let selectedArrivalStation = null;
// let trainOptions = [];
const btnInvert = document.getElementById('inverter');
export const initialPage = document.getElementById('initial_page');
export const resultsPage = document.getElementById('results_page');
export const simulator = document.getElementById('simulator-container');

// HTML interaction
// Initialize variables to store the selected stations
let selectedDepartureStation = null;
const arrivalStationSelect = document.getElementById('arrivalStationSelect');

// Listen for changes in the departure dropdown
departureStationSelect.addEventListener('change', function () {
  stationA = departureStationSelect.value;
  selectedDepartureStation = stationA;

  getBStations(stationA, function (BStations) {
    // emptying the arrival station options (except the first one (placeholder option - "DESTINO"))prior to repopulating it with more options.
    // if (arrivalStationSelect.options.length > 1) {
    //   arrivalStationSelect.remove(1); // Remove options at indexes greater than 0
    //   arrivalStationSelect.selectedIndex = 0;
    // }

    arrivalStationSelect.options.length = 1;
    arrivalStationSelect.options[0].selected = true;
    populateDropdown(arrivalStationSelect, BStations);
  });
});

let stationB = '';

// Listen for changes in the arrival dropdown and assign stationB
arrivalStationSelect.addEventListener('change', function () {
  selectedArrivalStation = arrivalStationSelect.value;
  stationB = selectedArrivalStation;
});

// Search trains:
// Listen for search train button click and build array of train objects:
submitButton.addEventListener('click', function () {
  if (stationA !== null && stationB !== '') {
    trainCheck(stationA, stationB)
      .then(() => {
        // const resultsPage = document.getElementById('results_page');
        // resultsPage.style.visibility = 'visible';

        const origin = document.getElementById('origin');
        origin.style.opacity = 1;

        origin.innerHTML = `<div id="origin">${stationA}</div>`;

        const destination = document.getElementById('destination');
        destination.style.opacity = 1;

        destination.innerHTML = `<div id="destination">${stationB}</div>`;

        let html;
        const teste = ['grey', 'blue'];

        simulator.style.display = 'none';
        // simulator.style.visibility = 'hidden';
        // simulator.style.pointerEvents = 'none';

        // Get the state language
        const htmlElement = document.documentElement; // Get the <html> element
        const curLanguage = htmlElement.lang;
        // const curLanguage = htmlElement.lang.split('-')[0];

        //Display available trains
        const availableTrains = document.querySelector('.train_options');
        availableTrains.innerHTML = '';

        trainOptions.forEach(train => {
          // console.log(
          //   `${train.name}: departs: ${train.departureTime} >>> arrives: ${train.arrivalTime} - Travel Time: ${train.travelTime}`
          // );
          // ////
          html = `<div id="train_options__row">
                  <div class="train-info">
                    <div class="title">${translations[curLanguage].train}</div>
                    <div class="value">${train.name}</div>
                  </div>
                  <div id="train-info1">
                    <div class="title">${translations[curLanguage].departure}</div>
                    <div class="value">${train.departureTime}</div>
                  </div>
                  <img id="to-sign" src="destination_arrow_black.10f2e7b9.png"></img>
                  <div id="train-info2">
                    <div class="title">${translations[curLanguage].arrival}</div>
                    <div class="value">${train.arrivalTime}</div>
                  </div>
                  <div id="train-info3">
                    <div class="title">${translations[curLanguage].travelTime}</div>
                    <div class="value">${train.travelTime}</div>
                  </div>
                </div>`;

          availableTrains.insertAdjacentHTML('beforeend', html);
          console.log(curLanguage);

          // document.getElementById('train_options__row').innerHTML = html;

          // console.log(travelTime);
        });

        togglePages(initialPage, resultsPage);
        resetTrainOptions();
      })
      .catch(error => {
        console.error('Error checking trains:', error);
      });
  } else {
    alert(
      // 'Please select both departure and arrival stations before submitting.'
      translations[document.documentElement.lang].alertMsg
      // 'Selecione a estação de origem e de destino para procurar as opções de trens.'
    );
  }
});

//${translations[language].train}

// Invert trip direction between to-from:
btnInvert.addEventListener('click', function () {
  //swap the values of selectedDepartureStation and selectedArrivalStation
  const temporaryStation = selectedDepartureStation;
  selectedDepartureStation = selectedArrivalStation;
  selectedArrivalStation = temporaryStation;

  // Set the new value of the departure station dropdown:
  for (let i = 0; i < departureStationSelect.options.length; i++) {
    if (departureStationSelect.options[i].value === selectedDepartureStation) {
      departureStationSelect.options[i].selected = true;
      break;
    }
  }

  // Getting the possible destination stations that can be reached from new stationA:
  stationA = selectedDepartureStation;
  getBStations(stationA, function (BStations) {
    arrivalStationSelect.innerHTML = ''; // emptying the arrival station options prior to repopulating it with more options.
    populateDropdown(arrivalStationSelect, BStations);

    for (let i = 0; i < arrivalStationSelect.options.length; i++) {
      if (arrivalStationSelect.options[i].value === selectedArrivalStation) {
        arrivalStationSelect.options[i].selected = true;
        break;
      }
    }
  });

  // remove the new departure station from the arrival station options dropdown field:
  const indexToRemove = Array.from(arrivalStationSelect.options).findIndex(
    option => option.value === selectedDepartureStation
  );

  // Remove the option at the specified index
  arrivalStationSelect.options[indexToRemove].remove();

  // Listen for changes in the departure dropdown
  departureStationSelect.addEventListener('change', function () {
    stationA = departureStationSelect.value;
    selectedDepartureStation = stationA;

    getBStations(stationA, function (BStations) {
      // emptying the arrival station options (except the first one (placeholder option - "DESTINO"))prior to repopulating it with more options.
      // if (arrivalStationSelect.options.length > 1) {
      //   arrivalStationSelect.remove(1); // Remove options at indexes greater than 0
      //   arrivalStationSelect.selectedIndex = 0;
      // }

      arrivalStationSelect.options.length = 0;
      // arrivalStationSelect.options[0].selected = true;
      populateDropdown(arrivalStationSelect, BStations);
      for (let i = 0; i < arrivalStationSelect.options.length; i++) {
        if (arrivalStationSelect.options[i].value === selectedArrivalStation) {
          arrivalStationSelect.options[i].selected = true;
          break;
        }
      }
      selectedArrivalStation = arrivalStationSelect.value;
      stationB = selectedArrivalStation;
      console.log(stationA, stationB);
    });
  });

  // Resetting the A and B stations so that I can search for the trains linked the new A-B selected stations:
  stationB = selectedArrivalStation;
  stationA = selectedDepartureStation;
});

export const calcTravelTime = function (departure, arrival) {
  const depTimeParts = departure.split(':');
  const dept = new Date();
  dept.setHours(parseInt(depTimeParts[0], 10));
  dept.setMinutes(parseInt(depTimeParts[1], 10));

  const arrTimeParts = arrival.split(':');
  const arr = new Date();
  arr.setHours(parseInt(arrTimeParts[0], 10));
  arr.setMinutes(parseInt(arrTimeParts[1], 10));

  // Adjusted arrival time when departure and arrival are in different days (to avoid negative travel times)
  const adjustedArrival = new Date(arr);
  adjustedArrival.setHours(adjustedArrival.getHours() + 24);

  const travelTime = arr > dept ? arr - dept : adjustedArrival - dept;
  // console.log(travelTime / (1000 * 60));

  const hours = Math.floor(travelTime / (1000 * 60 * 60));
  const minutes = Math.floor((travelTime % (1000 * 60 * 60)) / (1000 * 60));

  const formatedTravelTime =
    hours.toString() + ':' + minutes.toString().padStart(2, '0');
  return formatedTravelTime;
};

///////////////////////////////////////
//Language selecting logic:

document.addEventListener('DOMContentLoaded', () => {
  const languageOptions = document.querySelectorAll('.lang-menu a');
  const translatableElements = document.querySelectorAll('[data-translate]');
  const htmlElement = document.documentElement; // Get the <html> element

  // Function to update the text content of translatable elements
  function updateTextContent(translations) {
    translatableElements.forEach(element => {
      const key = element.getAttribute('data-translate');
      element.textContent = translations[key];
    });
  }

  // Set initial language based on <html> lang attribute
  const initialLanguage = htmlElement.lang.split('-')[0];
  changeLanguage(initialLanguage);

  // Function to change language
  function changeLanguage(language) {
    htmlElement.lang = language; // Set the lang attribute on the <html> element
    updateTextContent(translations[language]);

    // Toggle hidden class for the menuLang that don't represent the current selected languages:
    // languageSelected.forEach(option => {
    //   if (option.classList.contains(`menuLang${language.toUpperCase()}`)) {
    //     option.classList.remove('hidden');
    //   } else {
    //     option.classList.add('hidden');
    //   }
    // });

    // 2) Toggle hidden class for the menuLangs that don't represent the current selected language:

    const menuLangContainer = document.getElementById('menuLang');
    const menuLangItems = Array.from(menuLangContainer.children); // Convert HTMLCollection to Array

    // Iterate over each menu language item using forEach
    menuLangItems.forEach(menuLangItem => {
      if (menuLangItem.classList.contains(`${language.toUpperCase()}`)) {
        menuLangItem.classList.remove('hidden');
      } else {
        menuLangItem.classList.add('hidden');
      }
    });
  }

  // Add event listeners to language options
  languageOptions.forEach(option => {
    option.addEventListener('click', () => {
      const selectedLanguage = option.className
        .replace('lang-', '')
        .toLowerCase();
      changeLanguage(selectedLanguage);
    });
  });
});

///////////////////////////
// future implementation to make the code a bit more "MVC-like":
const init = function () {};
const populateDeptOptions = function () {};
const populateArrivalOptions = function () {}; // will listen to change in the selection of departure options
const findTrains = function () {}; // will listen to Search button click and take in arrival selected option to set StationB

// Display the train pictures
// let currentIndex = 0;
// const slides = document.querySelectorAll('.slide');
// const totalSlides = slides.length;

// function nextSlide() {
//   slides[currentIndex].style.display = 'none'; // Hide the current slide
//   currentIndex = (currentIndex + 1) % totalSlides; // Move to the next slide
//   slides[currentIndex].style.display = 'block'; // Show the next slide
// }

// Automatically advance to the next slide every 5 seconds
// setInterval(nextSlide, 4000);
////////////////////////////////////
