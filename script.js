//1 при нажатии на кнопку Хоум должен включится телефон 
// с загрузкой(спиннер) в течении 3 секунд и появится заставка
const phone = document.querySelector('.phone');
const volumeControls = document.querySelector('.volume_controls');
const turnUpVolume = document.querySelector('.turn_up_volume');
const turnDownVolume = document.querySelector('.turn_down_volume');
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
// во всех приложениях должна быть возможность закрыть его

const closeAppButtons = Array.from(document.querySelectorAll('.close_button'));

closeAppButtons.forEach(button => {
    button.addEventListener('click', () => {
        cameraAppContainer.classList.remove("active_screen");
        musicAppContainer.classList.remove("active_screen");
        todoAppContainer.classList.remove("active_screen");
        homeScreen.classList.add("active_screen");
    });
})


    
// 3.1 камера :
// при запуске этого приложеня на экране телефона должно вывестись изображение с камеры ноутбука или другого девайса

const cameraApp = document.querySelector('.camera_app');
const cameraAppContainer = document.querySelector('.camera_app_container');

cameraApp.addEventListener('click', function() {
    homeScreen.classList.remove("active_screen");
    cameraAppContainer.classList.add("active_screen");
    let video = document.getElementById('video');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function(err) { console.log(err.name + ": " + err.message); });
    };
});

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

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

musicApp.addEventListener('click', function() {
    homeScreen.classList.remove("active_screen");
    musicAppContainer.classList.add("active_screen");
});

let audioPlayer = document.querySelector(".audio-player");
const audio = new Audio(
    "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/backsound.mp3"
);
console.dir(audio);

audio.addEventListener(
    "loadeddata",
    () => {
      audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
        audio.duration
      );
      audio.volume = .75;
    },
    false
  );

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

//check audio percentage and update time accordingly
setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
        audio.currentTime
    );
}, 500);

//toggle between playing and pausing on button click
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
        audio.play();
    } else {
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
        audio.pause();
    }
}, 
false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = audioPlayer.querySelector(".volume-container .volume");
    audio.muted = !audio.muted;
    if (audio.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});

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



// ********
// сделать поисковик аля браузер с использыванием фрейма
//