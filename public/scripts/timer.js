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
let allAlarmRadios = document.querySelectorAll(".alarmSounds input");
let allPomoUpRadios = document.querySelectorAll(".pomoUpSounds input");

// input selectors to communicate data with backend
let userLoggedIn = document.querySelector("#userLoggedIn");
let alarmSoundInput = document.querySelector("#alarmSoundInput");
let pomoUpSoundInput = document.querySelector("#pomoUpSoundInput");
let pomoUpFormSubmit = document.querySelector("#pomoUpFormSubmit");
let breakSetup = document.querySelector("#breakSetup");
let alarmDisplay = document.querySelector("#alarmDisplay");
let pomoUpDisplay = document.querySelector("#pomoUpDisplay");
let testAlarmBtn = document.querySelector("#test-alarm-btn");
let testPomoUpBtn = document.querySelector("#test-pomoUp-btn");
let userPomoMin = document.querySelector("#user-pomo-min");
let userBreakMin = document.querySelector("#user-break-min");
let userLongBreakMin = document.querySelector("#user-long-break-min");

/// DECLARE VARIABLES ======================
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
  // set up all listeners for radio buttons
  setUpSoundPickListeners();

  // auto click on default sounds, so sounds are defined
  // if user is logged in, we check what they're saved sound options are
  if (userLoggedIn) {
    alarmNum = alarmSoundInput.value;
    pomoUpNum = pomoUpSoundInput.value;
  }
  // whether a guest or a user, we auto click on their set sounds
  allAlarmRadios[alarmNum].click();
  allPomoUpRadios[pomoUpNum].click();
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

function setUpSoundPickListeners(){
  // add listeners to radio buttons for choosing an alarm sound
  allAlarmRadios.forEach(function(radioBtn, index){
    radioBtn.addEventListener("click", function(){
      selectedAlarm = document.querySelector(".alarmSounds input:checked");
      chosenAlarm = selectedAlarm.value;
      alarm = new Audio('/sounds/alarm' + chosenAlarm + '.ogg');
      // change what is displayed for user's chosen sounds
      alarmNum = index;
      displaySounds(alarmNum, pomoUpNum)
      // make the invisible input on the front page retain the index of the sound
      // this will allow us to save the user's selection when sending to the backend
      // also, we have to make sure the user is logged in but seeing if the input exists
      if (userLoggedIn) {
        alarmSoundInput.value = index;
      }
    });
  });

  // add listeners to radio buttons for choosing a pomoUp sound
  allPomoUpRadios.forEach(function(radioBtn, index){
    radioBtn.addEventListener("click", function(){
      selectedPomoUp = document.querySelector(".pomoUpSounds input:checked");
      chosenUpSound = selectedPomoUp.value;
      pomoUpSound = new Audio('/sounds/pomoUp' + chosenUpSound + '.ogg');
      // change what is displayed for user's chosen sounds
      pomoUpNum = index;
      displaySounds(alarmNum, pomoUpNum)
      // make the invisible input on the front page retain the index of the sound
      // this will allow us to save the user's selection when sending to the backend
      // also, we have to make sure the user is logged in but seeing if the input exists
      if (userLoggedIn) {
       pomoUpSoundInput.value = index;
      }
    });
  });

  // Setup Listeners for Test buttons
  testAlarmBtn.addEventListener("click", function() {
    alarm.play();
  });
  testPomoUpBtn.addEventListener("click", function(){
    pomoUpSound.play();
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

function displaySounds(alarmNum, pomoUpNum) {
  alarmDisplay.innerText = allAlarmRadios[alarmNum].value;
  pomoUpDisplay.innerText = allPomoUpRadios[pomoUpNum].value;
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
