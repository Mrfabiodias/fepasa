import { calcTravelTime } from './controller.js';

let possibleTrains = []; // every train serving station A - to be used on a future version of the application, in the station timetable feature

export let AStations = [];

// Gets all stations served by the Fepasa trains from the database (for initial user  selection):
export const getAStations = function (callback) {
  fetch('trains.json')
    .then(res => res.json())
    .then(timetableData => {
      timetableData.forEach(elem =>
        elem.stations.forEach(elem => {
          if (!AStations.includes(elem.stationName)) {
            AStations.push(elem.stationName);
          }
        })
      );
      callback();
    });
};

export let BStations = [];

// Check all destination stations that can be connected by train from departure station (stationA):
export const getBStations = function (stationA, callback) {
  BStations = [];
  fetch('trains.json')
    .then(res => res.json())
    .then(timetableData => {
      timetableData.forEach(train =>
        train.stations.forEach(elem => {
          if (elem.stationName == stationA) {
            train.stations.forEach(elem => {
              if (!BStations.includes(elem.stationName)) {
                // if (!elem.stationName === stationA) {
                BStations.push(elem.stationName);
                // }
              }
              0;
            });
          }
        })
      );

      //Removing station A from station B list:
      let index = BStations.indexOf(stationA);
      BStations.splice(index, 1);

      if (callback && typeof callback === 'function') {
        callback(BStations);
      }
    });
};

// Emptying the array for the next train search:
let rawTrainOptions = [];
export let trainOptions = [];

//Function to sort the train options by acescending departure times:
const sortTrainOptions = function () {
  trainOptions.sort((a, b) => {
    const [aHours, aMinutes] = a.departureTime.split(':').map(Number);
    const [bHours, bMinutes] = b.departureTime.split(':').map(Number);

    if (aHours !== bHours) {
      return aHours - bHours;
    }

    return aMinutes - bMinutes;
  });
};

//Function to merge trains that travel together before being split down the line:
const mergeTrainOptions = function () {
  let mergedTrains = {};
  rawTrainOptions.forEach(train => {
    if (mergedTrains[train.departureTime]) {
      mergedTrains[train.departureTime].name += '/' + train.name;
    } else {
      mergedTrains[train.departureTime] = {
        name: train.name,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        travelTime: train.travelTime,
      };
    }
  });

  trainOptions = Object.values(mergedTrains);
};

export const resetTrainOptions = function () {
  rawTrainOptions = [];
  trainOptions = [];
};

// Searches for the trains that connect the origin and the destination stations (stationA and stationB):
export const trainCheck = async function (stationA, stationB) {
  resetTrainOptions();

  return fetch('trains.json')
    .then(res => res.json())
    .then(timetableData => {
      timetableData.forEach(train => {
        let iA; // where i is the index of the station element in the stations array
        let departure; // to catch departure time from station A
        train.stations.forEach(station => {
          if (station.stationName === stationA && station.departure !== '') {
            iA = station.stationName;
            departure = station.departure;
          } else if (
            station.stationName === stationB &&
            iA !== undefined &&
            departure !== '' &&
            station.arrival !== ''
          ) {
            rawTrainOptions.push(
              new TrainUi(
                train.trainName,
                convertTimeformat(departure),
                convertTimeformat(station.arrival)
              )
            );
            iA = undefined;
            departure = undefined;
          }
        });
      });
      mergeTrainOptions();
      sortTrainOptions();
      console.log(trainOptions);
    });
};

// creating train objects to be added to the train options array:
class TrainUi {
  constructor(name, departureTime, arrivalTime) {
    (this.name = name),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.travelTime = calcTravelTime(departureTime, arrivalTime));
  }
}

// Function to convert the time format that comes from DB into readable time format, considereing UTC time zone
const convertTimeformat = function (UTCtime) {
  // Split the offset time (03:06) into hours and minutes
  const offsetHours = 3;
  const offsetMinutes = 6;

  // Convert offset to milliseconds
  const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;

  // Subtract the offset from the UTC time
  const time = new Date(new Date(UTCtime) - offsetMilliseconds);

  // extract hours/minutes
  const hours = ('0' + time.getUTCHours()).slice(-2);
  const minutes = ('0' + time.getUTCMinutes()).slice(-2);

  const trainTime = hours + ':' + minutes;
  return trainTime;
};
