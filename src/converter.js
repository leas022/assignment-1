// function converts a json file containing events with a start and end
// time to discrete cell blocks represetning 30 minute increments of time
function converter(json, user) {
  const obj = JSON.parse(json);
  const newObj = [];

  // loops through the array of events to create cells for each indivdual event
  for (const event of obj.events) {
    const dayID = getDayID(event.start);
    const startTime = getTimeID(event.start);
    const endTime = getTimeID(event.end);
    const eventLength = numThirties(startTime, endTime); // how many 30 minute cells exist in the event
    let timeID = startTime;
    // loops through to create a cell for each 30 minute increment
    for (let i = 0; i < eventLength; i++) {
      const newCell = {
        id: `${dayID}-${timeID}`,
        users: [user],
        numPeople: 1,
      };
      newObj.push(newCell);
      timeID = incrementTime(timeID);
    }
  }
  return JSON.stringify({ cells: newObj });
}

// function outputs the time part of the id to be appended to the day segment, creating the cell id
function getTimeID(eventTime) {
  const array = eventTime.split(" ");
  eventTime = array[1].replace(":", "");
  if (array[2] === "PM") {
    // converts to 24 hour time standard
    return (parseInt(eventTime) + 1200).toString();
  }
  return eventTime;
}

// function outputs the day segment of the id for the cell
function getDayID(day) {
  const array = day.split(" ");
  return day.slice(0, 3).toLowerCase();
}

// function outputs the number of 30 minute increments (represented by cells) in the event
function numThirties(startTime, endTime) {
  return (
    (parseInt(endTime.slice(0, 2)) * 60 +
      parseInt(endTime.slice(2, 4)) -
      (parseInt(startTime.slice(0, 2)) * 60 +
        parseInt(startTime.slice(2, 4)))) /
    30
  );
}

// function outputs the inputted time after being increment by 30 minutes
function incrementTime(timeID) {
  const hours = parseInt(timeID.substring(0, 2));
  const minutes = parseInt(timeID.substring(2, 4));
  if (minutes === 30) {
    if (hours < 10) {
      timeID = `0${hours + 1}00`;
    } else {
      timeID = `${hours + 1}00`;
    }
  } else {
    if (hours < 10) {
      timeID = `0${hours}30`;
    } else {
      timeID = `${hours}30`;
    }
  }
  return timeID;
}

module.exports = converter;
