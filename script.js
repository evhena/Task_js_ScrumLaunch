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
        setTimeout(showBlockedScreen, 3000);  //3000
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
});

var video = document.getElementById('video');

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
};

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


// 3.3 туду лист
//   авторизация
//   поле создания задачи
//   список невыполненых задач (кнопка удаления, кнопка завершения)
//   кнопка для вывода списка выполненых задач

const todoApp = document.querySelector('.todo_app');
const todoAppContainer = document.querySelector('.todo_app_container');
const todoDoneContainer = document.querySelector(".todo_done_container");

todoApp.addEventListener('click', () => {
    homeScreen.classList.remove("active_screen");
    todoAppContainer.classList.add("active_screen");
})

function onPageLoaded() {
    const inputTodo = document.querySelector(".todo_input");
    const todoList = document.querySelector("ul.todo_list");
    const saveListButton = document.querySelector(".button_save_list");
    const clearListButton = document.querySelector(".button_clear_list");
    const showListDone = document.querySelector(".button_list_done");

    function createTodo() {
        const todoItem = document.createElement("LI");
        todoItem.classList.add("todo_list_item");
        
        const todoLabel = document.createElement("LABEL");
        todoLabel.classList.add("todo_text_wrapper");
        
        const checkBox = document.createElement("INPUT");
        checkBox.type = "checkbox";
        
        const todoText = document.createElement("SPAN");
        todoText.classList.add("todo_text");
        
        let newTodo = inputTodo.value;
        
        if (newTodo) {
            todoText.innerHTML = newTodo;
            todoList.appendChild(todoItem);
            todoLabel.appendChild(checkBox);
            todoLabel.appendChild(todoText);
            todoItem.appendChild(todoLabel);
        }

        inputTodo.value = "";

        const iconTrash = document.createElement("I");
        iconTrash.classList.add("far", "fa-trash-alt");
        todoItem.appendChild(iconTrash);
        deleteTodos(iconTrash);
        

        checkBox.addEventListener('change', function () {
            if (this.checked) {
                this.parentElement.classList.add("checked");
                console.log("Checkbox is checked..");
                localStorage.setItem("listWhatAlredyDone", this.parentElement.innerHTML);
            } else {
                console.log("Checkbox is not checked..");
                this.parentElement.classList.remove("checked");
            }   
        });
    }


    inputTodo.addEventListener('keyup', function(e) {
        if (e.which === 13) {
            createTodo();
        }
    });

    let todoAdd = document.querySelector(".todo_add");
    todoAdd.addEventListener('click', () => {
        createTodo();
    }); 
 
    inputTodo.addEventListener('dblclick', () => {
            console.log('create todo dblClick');
            createTodo();
    });

    function deleteTodos(el) {
        el.addEventListener('click', (event) => {
            el.parentElement.remove();
            event.stopPropagation();
        });
    }

    saveListButton.addEventListener('click', ()=> {
        localStorage.setItem("todoList", todoList.innerHTML);
    });

    clearListButton.addEventListener("click", ()=> {
        todoList.innerHTML = "";
        localStorage.removeItem("todoList", todoList.innerHTML);
    });

    function loadTodos() {
        const data = localStorage.getItem("todoItem");
        if (data) {
            todoList.innerHTML = data;
        }
        const deleteButtons = document.querySelectorAll('todos_trash');
        for (const button of deleteButtons) {
            listenDeleteTodos(button);
        }
    }

    
    showListDone.addEventListener("click", ()=> {
        todoAppContainer.classList.remove("active_screen");
        todoDoneContainer.classList.add("active_screen");
    
        const listItemDone = document.querySelector('todo_done_list');
    
 
        let arrAllTasksLi = Array.from(document.querySelectorAll(".todo_list_item"));

        let arrAllTasksLabels = [];
        for (let i=0; arrAllTasksLi.length > i; i++) {
            let labelItem = arrAllTasksLi[i].firstChild;
            arrAllTasksLabels.push(labelItem);
        }
    
        let arrAllTasksChecked = [];
        arrAllTasksLabels.forEach((label)=>{
            if (label.classList.contains("checked")) {
                let newChecked = label.innerTex;
                arrAllTasksChecked.push(label.innerText); 
            }
        })

        arrAllTasksChecked.forEach((el)=>{
            const itemDone = document.createElement('LI');
            itemDone.classList.add('item_done');
            listItemDone.appendChild(itemDone);
            itemDone.innerHTML = el;
        })
    });

    const backButton = document.querySelector(".back_button");
    backButton.addEventListener('click', ()=> {
        console.log('list done is closed');
        todoDoneContainer.classList.remove("active_screen");
        todoAppContainer.classList.add("active_screen");
    })

    loadTodos();
}

document.addEventListener("DOMContentLoaded", onPageLoaded);

// ********
// сделать поисковик аля браузер с использыванием фрейма
//