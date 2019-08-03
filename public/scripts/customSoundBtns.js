let allAlarmRadios = document.querySelectorAll(".alarmSounds input");
let allPomoUpRadios = document.querySelectorAll(".pomoUpSounds input");
let testAlarmBtn = document.querySelector("#test-alarm-btn");
let testPomoUpBtn = document.querySelector("#test-pomoUp-btn");
let submitSoundform = document.querySelector("#submit-sound-form");
let submitSoundBtn = document.querySelectorAll("#submit-sound-btn");
let alarmSoundInput = document.querySelector("#alarmSoundInput");
let pomoUpSoundInput = document.querySelector("#pomoUpSoundInput");
let selectedAlarm, selectedPomoUp, alarm, pomoUpSound, alarmNum, pomoUpNum,
  chosenAlarm, chosenUpSound;

submitSoundBtn.forEach(function(btn) {
  btn.addEventListener("click", function(){
    submitSoundform.click();
  });
});

soundInit();

function soundInit() {
  setUpSoundPickListeners();
  alarmNum = alarmSoundInput.value;
  pomoUpNum = pomoUpSoundInput.value;
  allAlarmRadios[alarmNum].click();
  allPomoUpRadios[pomoUpNum].click();


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
      // make the invisible input on the front page retain the index of the sound
      // this will allow us to save the user's selection when sending to the backend
      // also, we have to make sure the user is logged in but seeing if the input exists
      alarmSoundInput.value = index;
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
      // make the invisible input on the front page retain the index of the sound
      // this will allow us to save the user's selection when sending to the backend
      // also, we have to make sure the user is logged in but seeing if the input exists
      pomoUpSoundInput.value = index;
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
