//1 при нажатии на кнопку Хоум должен включится телефон 
// с загрузкой(спиннер) в течении 3 секунд и появится заставка
const phone = document.querySelector('.phone');
const frontSpeaker = document.querySelector('.front_speaker');
const screenPhone = document.querySelector('.screen');
const offScreen = document.querySelector('.off_screen');
const blockedScreen = document.querySelector('.blocked_screen');
const homeScreen = document.querySelector('.home_screen');
const unblockedContainer = document.querySelector('.unblocked_container');
const homeButton = document.querySelector('.home_button');
const preloader = document.querySelector('.preloader');

preloader.style.display = 'none';
offScreen.classList.add('active_screen');

homeButton.addEventListener('click', function(evt) {
    if (evt.detail === 3) {
        console.log('triple click!');
        phoneOFF();
    } else if (evt.detail === 1) {
        startScreen();
    }
});

function startScreen() {
    if (offScreen.classList.contains('active_screen')) {
        preloader.style.display = 'block';
        setTimeout(showBlockedScreen, 0);  //3000
    }
}

function showBlockedScreen() {
    preloader.style.display = 'none';
    offScreen.classList.remove('active_screen');
    blockedScreen.classList.add('active_screen');
}


// 1.1 при длительном нажатии на кнопку хоум (в течении 3 секунд) или при тройном нажатии телефон должен выключится с той же анимацией
let timer = 0,
    timerInterval;

function phoneOFF() {
    preloader.style.display = 'block';
    setTimeout(showOFFScreen, 3000);
}

function showOFFScreen() {
    preloader.style.display = 'none';
    blockedScreen.classList.remove("active_screen");
    homeScreen.classList.remove("active_screen");
    offScreen.classList.add('active_screen');
}

homeButton.addEventListener("mousedown", function() {
    timerInterval = setInterval(function(){
    timer += 1;    
    }, 3000);
});

homeButton.addEventListener("mouseup", function() {
    clearInterval(timerInterval);
    if (timer >= 1) {
        console.log('long pressing works');
        phoneOFF();
    }
    timer = 0;
});



// 2 экран заблокированного телефона с текущем временем(ч:м:с), датой и контроллером для разблокировки телефона
const time = document.querySelector('.time');
const date = document.querySelector('.date');
let currentDate = new Date();

// function getCurrentTimeString(dots) {
//     var timeString = currentDate.toTimeString().replace(/:[0-9]{2,2} .*/, '');
//     return dots ? timeString : timeString.replace(/:/, ' ');
// }

// setInterval(
//     function() { 
//        time.innerHTML = getCurrentTimeString(Math.round(Date.now() / 1000) % 2);
//     },
//     1000
// );

function getCurrentTime() {
    return new Date().toTimeString().replace(/ .*/, '');
}

setInterval(
    () => time.innerHTML = getCurrentTime(),
    1000
);

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "October", "November", "December"];
let currentDay = daysOfWeek[currentDate.getDay()] + ", " + months[currentDate.getMonth()] + " " + currentDate.getDate();
date.innerHTML = currentDay;

// когда бегунок передвигается в левую часть своего контейнера 
// просходит анимация разблокировки телефона и открывается главная страница

let unblockPhone = document.getElementById('unblockPhone');

unblockPhone.addEventListener("change", function(evt) {
    if (this.value == 100) {
      blockedScreen.classList.remove("active_screen");
      homeScreen.classList.add("active_screen");
    }
    this.value = 0;
}); 

// 3 на главной странице 
// должны быть минимум три приложение


// 3.1 камера :
// при запуске этого приложеня на экране телефона должно вывестись изображение с камеры ноутбука или другого девайса

const cameraApp = document.querySelector('.camera_app');
const cameraAppContainer = document.querySelector('.camera_app_container');
const video = document.getElementById('video');
const stream = video.srcObject;

cameraApp.addEventListener('click', function() {
    homeScreen.classList.remove("active_screen");
    cameraAppContainer.classList.add("active_screen");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function(err) { console.log(err.name + ": " + err.message); });
    };
});
console.log(video)
function stopStreamedVideo(videoElem) {
    const stream = video.srcObject; 
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
  
    video.srcObject = null;
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.translate(canvas.width, 0);
context.scale(-1, 1);

document.getElementById("snap").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 640, 480);
});


// 3.2 музыка :
// на эране должно появится мултимедия с возможностю запустить/остановить музыку и прогрес музыки
// звук должен выводится на девайс (громкость зависит от растояния курсора от динамика в верху телефона)
// при нажатии на кнопки громкости должна происходить анимация нажатия и на экране должно появлятся шкала громкости

const musicApp = document.querySelector('.music_app');
const musicAppContainer = document.querySelector('.music_app_container');
let audioPlayer = document.querySelector(".audio-player");
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
const volumeIcon = audioPlayer.querySelector(".volume-button");
const volumeEl = audioPlayer.querySelector(".volume-container .volume");


musicApp.addEventListener('click', function() {
    homeScreen.classList.remove("active_screen");
    musicAppContainer.classList.add("active_screen");
    listenVolumeButtons();
    listenPlayPauseButton();
    listenVolumeIconToMute();
});


let audio = new Audio(
    "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/backsound.mp3"
);
console.dir(audio);

let currentVolume = audio.volume;
const timeLength = audioPlayer.querySelector(".time .length");

audio.addEventListener("loadeddata", ()=>{
    timeLength.textContent = getTimeCodeFromNum(audio.duration);
    currentVolume = audio.volume = .75;
}, false);

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
}, false);

//check audio percentage and update time accordingly
setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
        audio.currentTime
    );
}, 500);

//toggle between playing and pausing on button click
let listenerPlay = function() {
    if (audio.paused) {
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
        audio.play();
    } else {
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
        audio.pause();
    }
} 
function listenPlayPauseButton() {
    playBtn.addEventListener("click", listenerPlay, false);
}

let listenMuteButton = function() {
    audio.muted = !audio.muted;
        if (audio.muted) {
            volumeEl.classList.remove("icono-volumeMedium");
            volumeEl.classList.add("icono-volumeMute");
        } else {
            volumeEl.classList.add("icono-volumeMedium");
            volumeEl.classList.remove("icono-volumeMute");
        }
}

function listenVolumeIconToMute() {
    volumeIcon.addEventListener("click", listenMuteButton, false);
}

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}

//calculate distance from mouse to speaker
let mouseX, mouseY;

function calculateDistance(mouseX, mouseY) {
    let speaker = document.querySelector(".front_speaker");
    let coodrsSpeaker = speaker.getBoundingClientRect();
    return Math.floor(Math.sqrt(Math.pow(mouseX - (coodrsSpeaker.left+(coodrsSpeaker.width/2)), 2) + 
        Math.pow(mouseY - (coodrsSpeaker.top+(coodrsSpeaker.height/2)), 2)));
}

//when we take closer to speaker music become louder
let speakerClosestyCoefficient;

let listenMouseMoveCloserToSpeaker = function(e) {
    let maxDistance = 800;
    mouseX = e.pageX;
    mouseY = e.pageY;
    let distance = calculateDistance( mouseX, mouseY);
    speakerClosestyCoefficient = (100 - (distance * 100 / maxDistance)) / 100;
    //console.log(speakerClosestyCoefficient)
    setNewVolume()
    }

function listenDistanceToSpeaker(newVolume) {
    document.addEventListener('mousemove', listenMouseMoveCloserToSpeaker, false);
}

function setNewVolume(){
    audio.volume = currentVolume * speakerClosestyCoefficient;
}

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    let newVolume = e.offsetX / parseInt(sliderWidth);
    currentVolume = newVolume;
    changeVolumeStyle();
    setNewVolume();
}, false)

//behavior phone volume buttons
let phoneVolumePercentage = document.querySelector(".phone_volume-percentage");
let phoneVolume = document.querySelector(".phone_volume");
const turnUpVolume = document.querySelector(".turn_up_volume");
const turnDownVolume = document.querySelector(".turn_down_volume");

let turnUpVolumeListener = function(event) {
    console.log("click turn UP volume");
    turnUpVolume.classList.add("active");
    setTimeout(()=>{turnUpVolume.classList.remove("active")}, 500);
    phoneVolume.classList.add("show") ;
    setTimeout(()=>{phoneVolume.classList.remove("show")}, 1500); 
    phoneVolumePercentage.style.height = currentVolume * 100 + '%';

    if (currentVolume < 0.9) {
        currentVolume = currentVolume + 0.1;
        changeVolumeStyle();
        setNewVolume()
    };
}

let turnDownVolumeListener = function(event) {
    console.log("click turn DOWN volume");
    turnDownVolume.classList.add("active");
    setTimeout(()=>{turnDownVolume.classList.remove("active")}, 500);
    phoneVolume.classList.add("show");
    setTimeout(()=>{phoneVolume.classList.remove("show")}, 1500); 

    phoneVolumePercentage.style.height = currentVolume * 100 + '%';
    if (currentVolume > 0.1) {
        currentVolume = currentVolume - 0.1;
        changeVolumeStyle();
        setNewVolume()
    }
}

function listenVolumeButtons() {
    listenDistanceToSpeaker();
    turnUpVolume.addEventListener('click', turnUpVolumeListener, false);
    turnDownVolume.addEventListener("click", turnDownVolumeListener, false);
}

function changeVolumeStyle() {
    phoneVolumePercentage.style.height = currentVolume * 100 + '%';
    audioPlayer.querySelector(".controls .volume-percentage").style.width = currentVolume * 100 + '%';
}


// 3.3 туду лист
//   авторизация
//   поле создания задачи
//   список невыполненых задач (кнопка удаления, кнопка завершения)
//   кнопка для вывода списка выполненых задач

const todoApp = document.querySelector('.todo_app');
const todoAppContainer = document.querySelector('.todo_app_container');
const todoDoneContainer = document.querySelector(".todo_done_container");
const inputTodo = document.querySelector(".todo_input");
let list = new Object;

todoApp.addEventListener('click', () => {
    homeScreen.classList.remove("active_screen");
    todoAppContainer.classList.add("active_screen");
    initLocalStorage();
})

function createItem(sourceText, dateCreateItem) {
    const item = new Object;
    item.text = sourceText;
    item.status = 'active';
    item.created_at = dateCreateItem.toLocaleString();
    return item;
}


function showItem(todoList, item, key) {
    if (!item.text) {
        console.log(`empty input`);
        return;
    }
    const todoItem = document.createElement("LI");
    todoItem.classList.add("todo_list_item");
    
    const todoLabel = document.createElement("LABEL");
    todoLabel.classList.add("todo_text_wrapper");
    
    const checkBox = document.createElement("INPUT");
    checkBox.type = "checkbox";
    subscribeCheckItem(checkBox, key);
    
    if (item.status == 'done') {
        todoLabel.classList.add("checked");
        checkBox.checked = "true";
    }
    
    const todoText = document.createElement("SPAN");
    todoText.classList.add("todo_text");

    todoText.innerHTML = item.text;
    todoList.appendChild(todoItem);
    todoLabel.appendChild(checkBox);
    todoLabel.appendChild(todoText);
    todoItem.appendChild(todoLabel);

    const iconTrash = document.createElement("I");
    iconTrash.classList.add("far", "fa-trash-alt");
    todoItem.appendChild(iconTrash);
    subscribeDeleteItem(iconTrash, key); 
}

//Del button
function subscribeDeleteItem(el, key) {
    el.addEventListener('click', (event) => {
        list[key].status = 'deleted';
        el.parentElement.remove();
        saveToLocalStorage();
        event.stopPropagation();
    });
}

//Checkbox
function subscribeCheckItem(el, key) {
    el.addEventListener('change', function checkAndUncheck() {
        if (this.checked) {
            this.parentElement.classList.add("checked");
            list[key].status = 'done';
            setTimeout(() => {
                this.parentElement.parentElement.remove();
            }, 1000);  
        } else {
            list[key].status = 'active';
            this.parentElement.classList.remove("checked");
            setTimeout(() => {
                this.parentElement.parentElement.remove();
            }, 1000);
        }
        saveToLocalStorage(); 
    });
}


//listeners for Input
let todoAdd = document.querySelector(".todo_add");
todoAdd.addEventListener('click', () => {
    textFromUser = inputTodo.value;
    createTodoFromUser(textFromUser);
    inputTodo.value = "";
});

inputTodo.addEventListener('keyup', function(e) {
    if (e.which === 13) {
        textFromUser = inputTodo.value;
        createTodoFromUser(textFromUser);
        inputTodo.value = "";
    }
});

inputTodo.addEventListener('dblclick', () => {
    textFromUser = inputTodo.value;
    createTodoFromUser(textFromUser);
    inputTodo.value = "";
});


function createTodoFromUser(sourceText) {
    const dateCreateItem = new Date;
    const key = sourceText + '_' + dateCreateItem.getTime();
    const item = createItem(textFromUser, dateCreateItem);
    let todoList = document.querySelector("ul.todo_list");
    list[key] = item;
    showItem(todoList, item, key);
    saveToLocalStorage(); 
}


function createTodoFromStorage() {
    todoList = document.querySelector("ul.todo_list");
    todoList.innerHTML = "";
    for (key in list) {
        if (list[key].status == "active") {
            item = list[key];
            showItem(todoList, item, key);
        }
    };
}


function initLocalStorage() {
    if (localStorage.getItem('taskPhone_todoList') !== null) {
        list = JSON.parse(localStorage.getItem("taskPhone_todoList"));
        createTodoFromStorage(list);
    } else {
        saveToLocalStorage();
    }
}


function saveToLocalStorage() {
    localStorage.setItem('taskPhone_todoList', JSON.stringify(list));
    console.log(`List saved to local storage` +  JSON.stringify(list));
}


const showListDone = document.querySelector(".button_list_done");
showListDone.addEventListener("click", ()=> {
    todoAppContainer.classList.remove("active_screen");
    todoDoneContainer.classList.add("active_screen");
    createListItemDone(list);
});

function createListItemDone() {
    todoList = document.querySelector("ul.todo_done_list");
    todoList.innerHTML = "";
    for (key in list) {
        if (list[key].status == "done") {
            item = list[key];
            showItem(todoList, item, key);
        }
    }
   
    const backButton = document.querySelector(".back_button");
    backButton.addEventListener('click', ()=> {
        todoDoneContainer.classList.remove("active_screen");
        todoAppContainer.classList.add("active_screen");
        initLocalStorage();
    })
}


// во всех приложениях должна быть возможность закрыть его

const closeAppButtons = Array.from(document.querySelectorAll('.close_button'));

closeAppButtons.forEach(button => {
    button.addEventListener('click', () => {
        cameraAppContainer.classList.remove("active_screen");
        musicAppContainer.classList.remove("active_screen");
        todoAppContainer.classList.remove("active_screen");
        homeScreen.classList.add("active_screen");
        //remove listeners for player and volume buttons
        document.removeEventListener('mousemove', listenMouseMoveCloserToSpeaker, false);
        playBtn.removeEventListener("click", listenerPlay, false);
        turnUpVolume.removeEventListener('click', turnUpVolumeListener, false);
        turnDownVolume.removeEventListener("click", turnDownVolumeListener, false);
        volumeIcon.removeEventListener("click", listenMuteButton, false);
        if (video.srcObject) {
            stopStreamedVideo();
        }
    });
})

// ********
// сделать поисковик аля браузер с использыванием фрейма
//