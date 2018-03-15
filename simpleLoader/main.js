const electron = require('electron');
const path = require('path');
const url = require('url');

const {app,BrowserWindow, Menu} = electron;

let mainWindow;

//on app is ready
app.on('ready',function(){
    //create new window
    mainWindow = new BrowserWindow({
        width : 520,
        height : 380,
        resizable : false
    });

    //load browser url
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'myapp.html'),
        protocol : 'file',
        slashes : true
    }));

    let mainmenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainmenu);

})

//the main menu
const menu = [
    {
        label : 'File',
        submenu : [
            {
                label : 'quit',
                accelerator : (process.platform === 'darwin') ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

//if mac uhhh..
if(process.platform === 'darwin') {
    menu.unshift({});
}