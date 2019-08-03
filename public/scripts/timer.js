/*jshint esversion: 6 */
/// DECLARE SELECTORS =======================
let startBtn = document.querySelector(".start-btn");
let pauseBtn = document.querySelector(".pause-btn");
let cancelBtn = document.querySelector(".cancel-btn");
let breakBtn = document.querySelector(".break-btn");
let longBreakBtn = document.querySelector(".long-break-btn");
let skipBreakBtn = document.querySelector(".skip-break-btn");
let minDisplay = document.querySelector(".min");
let secDisplay = document.querySelector(".sec");
let title = document.querySelector("title");
let pomosDisplay = document.querySelector(".pomos-done");

// input selectors to communicate data with backend
let userLoggedIn = document.querySelector("#userLoggedIn");
let alarmSoundInput = document.querySelector("#alarmSoundInput");
let pomoUpSoundInput = document.querySelector("#pomoUpSoundInput");
let pomoUpFormSubmit = document.querySelector("#pomoUpFormSubmit");
let breakSetup = document.querySelector("#breakSetup");
let testAlarmBtn = document.querySelector("#test-alarm-btn");
let testPomoUpBtn = document.querySelector("#test-pomoUp-btn");
let userPomoMin = document.querySelector("#user-pomo-min");
let userBreakMin = document.querySelector("#user-break-min");
let userLongBreakMin = document.querySelector("#user-long-break-min");

/// DECLARE VARIABLES ======================
let alarmSoundsArr = [
  "Default",
  "Drop",
  "Frog",
  "Holiday",
  "Horse",
  "Spring"
];
let pomoUpSoundsArr = [
  "Default",
  "Coin",
  "LevelUp",
  "Shiver"
]
let breakOn = false;
let pomoOn = false;
let alarmNum = 0;
let pomoUpNum = 0;

// pomosDisplay's inner text will show the amount a logged in user has already done on page load
// if the user isn't logged in, it'll show 0 by defaut on page load
// so we automatically want pomosDone to equal this amount
// this is an indirect way to get data from the backend
let pomosDone = pomosDisplay.innerText;
let min, sec, countdown, chosenAlarm, alarm,
    chosenUpSound, pomoUpSound, skipMidbreak,
    selectedAlarm, selectedPomoUp;

// DECLARE FUNCTIONS ===========================================

// check if user logged in & on break page by accident
// if not redirect them to front
// userLoggedIn will only show up on the page if a user is logged in
// so it is being used here to see if user is logged in
if (breakSetup.value === "ON" && !userLoggedIn) {
  window.location.replace("/front");
} else {
  // This will set up the button event listeners & number displays
  timerInit();
}


// INIT FUNCTION --------------------------------------
function timerInit() {

  // this is to check if the users have just finished a pomo
  // if they have, it has been sent to the backend to update their
  // pomo count, now they're back here, so we give them the break button
  // otherwise, we give them the standard pomo setup
  if (breakSetup.value === "ON") {
    breakRoundSetup();
  } else {
    pomoRoundSetup(); // sets up the min, sec, and start button
  }

  // set up all listeners for buttons
  setUpListeners();
  // set up sounds
  setUpSounds();
}

// SETUP SOUNDS -----------------------------------------------
function setUpSounds() {
  if (userLoggedIn) {
    chosenAlarm = alarmSoundsArr[alarmSoundInput.value];
    chosenUpSound = pomoUpSoundsArr[pomoUpSoundInput.value];
  } else {
    chosenAlarm = "Default";
    chosenUpSound = "Default";
  }

  alarm = new Audio('/sounds/alarm' + chosenAlarm + '.ogg');
  pomoUpSound = new Audio('/sounds/pomoUp' + chosenUpSound + '.ogg');
}

// SETUP Button Listeners --------------------------------
function setUpListeners(){

  startBtn.addEventListener("click", function(){
    startBtn.classList.add("invisible");
    pauseBtn.classList.remove("invisible");
    cancelBtn.classList.remove("invisible");
    pomoOn = true;
    countdownOn();
  });

  pauseBtn.addEventListener("click", function(){
    startBtn.classList.remove("invisible");
    pauseBtn.classList.add("invisible");
    pomoOn = false;
    clearTimeout(countdown);
  });

  cancelBtn.addEventListener("click", function(){
    startBtn.classList.remove("invisible");
    pauseBtn.classList.add("invisible");
    cancelBtn.classList.add("invisible");
    pomoOn = false;
    clearTimeout(countdown);
    pomoRoundSetup();
  });

  breakBtn.addEventListener("click", function(){
    breakBtn.classList.add("invisible");
    longBreakBtn.classList.add("invisible");
    breakOn = true;
    pomoUp();
    countdownOn();
  });

  longBreakBtn.addEventListener("click", function(){
    breakBtn.classList.add("invisible");
    longBreakBtn.classList.add("invisible");
    // check if user logged in, replace min with user's choice
    if (userLoggedIn) {
      min = Number(userLongBreakMin.value);
    } else {
      min = 15;
    }
    minDisplay.innerText = min;
    breakOn = true;
    pomoUp();
    countdownOn();
  });

  skipBreakBtn.addEventListener("click", function(){
    if (breakOn) {
      skipMidbreak = true;
      clearTimeout(countdown);
      timesUp();
    } else {
      pomoUp();
      pomoRoundSetup();
    }
  });
}


// SETUP PomoROUND AND BREAK FUNCTIONS -------------------------------
function breakRoundSetup(){
  // check if user logged in, replace min with user's choice
  if (userLoggedIn) {
    min = Number(userBreakMin.value);
  } else {
    min = 5;
  }
  sec = 0;
  minDisplay.innerText = min;
  secDisplay.innerText = "00";
  // checks if four rounds have passed, make 15 minute break button appear
  // here we use the pomosDisplay text instead of pomosDone
  // this way it can work with both guests and logged in users
  if ((Number(pomosDisplay.innerText) + 1) % 4 === 0) {
    longBreakBtn.classList.remove("invisible");
  }
  breakBtn.classList.remove("invisible");
  skipBreakBtn.classList.remove("invisible");
  pauseBtn.classList.add("invisible");
  cancelBtn.classList.add("invisible");
}

function pomoRoundSetup(){
  // check if user logged in, replace min with user's choice
  if (userLoggedIn) {
    min = Number(userPomoMin.value);
  } else {
    min = 25;
  }
  sec = 0;
  minDisplay.innerText = min;
  secDisplay.innerText = "00";
  startBtn.classList.remove("invisible");
  breakBtn.classList.add("invisible");
  longBreakBtn.classList.add("invisible");
  skipBreakBtn.classList.add("invisible");
}

// COUNTDOWN, TIMES UP, and PomoRounds done FUNCTIONS--------------------
function countdownOn() {
  countdown = // declaring it as a variable we can use clearTimeout()
    setTimeout(function () {
      sec--;
      if (sec + min < 0) {
        // timesUp will end the recursion by making pomoOn & breakOn false
        timesUp();
      } else {
        updateTimeDisplays()
      }
      // check pomoOn and breakOn are true to know we're still counting
      // use recursive case to call upon countdownOn again
      if (pomoOn || breakOn) {
        countdownOn();
      }
    }, 1000);
}

function timesUp() {
  clearTimeout(countdown);
  if (!skipMidbreak) {
    alarm.play();
  } else if (skipMidbreak){
    skipMidbreak = false;
  }
  if (pomoOn) {
    pomoOn = false;
    // checks to see if user is logged in
    if (userLoggedIn) {
      // sends pomo to backend
      // waits for alarm to finish
      setTimeout(updateBackEndPomo, 1500);
    } else {
      breakRoundSetup(); // sends guest to break
    }
  } else if (breakOn) {
    breakOn = false;
    title.innerText = "25:00";
    pomoRoundSetup();
  }
}

function pomoUp(){
  pomosDone++;
  pomosDisplay.classList.add("pomo-up");
  pomosDisplay.innerText = pomosDone + "+";
  pomoUpSound.play();
  setTimeout(function () {
    pomosDisplay.classList.remove("pomo-up");
    pomosDisplay.innerText = pomosDone;
  }, 1000);
}

function updateBackEndPomo(){
  // if yes, this will send a put request to express
  pomoUpFormSubmit.click();
}

function updateTimeDisplays() {
  if (sec === -1) {
    sec = 59;
    min--;
    secDisplay.innerText = sec;
  } else if (sec < 10) {
    secDisplay.innerText = "0" + String(sec);
  } else if (sec === 60) {
    secDisplay.innerText = "00";
  } else {
    secDisplay.innerText = sec;
  }
  minDisplay.innerText = min;
  // update title text
  title.innerText = minDisplay.innerText + ":" + secDisplay.innerText;
}
