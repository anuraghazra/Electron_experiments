const electron = require('electron');
const path = require('path');
const remote = electron.remote;

//Titlebar buttons
let closeBtn = document.getElementById('closeWindow');
let minBtn = document.getElementById('minWindow');
let maxBtn = document.getElementById('maxWindow');

//Close , minimize, maximize
closeBtn.addEventListener('click',function() {
    let window = remote.getCurrentWindow();
    window.close();
})
minBtn.addEventListener('click',function() {
    let window = remote.getCurrentWindow();
    window.minimize();
})
maxBtn.addEventListener('click',function() {
    let window = remote.getCurrentWindow();
    if(window.isMaximized()) {
        window.restore();
        this.children[0].classList.remove('icon-window-restore');
    } else {
        window.maximize();
        this.children[0].classList.add('icon-window-restore');
    }
})

//notifycations
function showNotification() {
    const notifydata = {
        body : 'Dont Forget To Save Your Art!',
        icon : path.join(__dirname,'../assets/icons/logo.png'),
    }
    let notify = new window.Notification('Verlet Drawing',notifydata);
}
window.setTimeout(showNotification,20000);