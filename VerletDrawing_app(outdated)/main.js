const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow,Menu} = electron;

//onReady
app.on('ready',function() {
    //create window
    let mainWindow = new BrowserWindow({
        width : 1366,
        height : 768,
        minWidth : 1000,
        minHeight : 560,
        frame : false,
        icon : path.join(__dirname,'assets/icons/win/icon2.ico'),
    });

    //load window
    mainWindow.loadURL(url.format({
        protocol : 'file',
        pathname : path.join(__dirname,'src/index.html'),
        slashes : true
    }));


    //Optimize Window
    mainWindow.on('close',function() {
        mainWindow = null;
    });
    mainWindow.on('closed',function() {
        mainWindow = null;
        app.quit();
    });

    
    //Menu And Shortcuts
    const mainMenu = [
        {
            label : 'developerTools',
            accelerator : 'CTRL+I',
            click() {
                mainWindow.webContents.openDevTools();
            }
        },
        {
            label : 'reload',
            accelerator : 'CTRL+R',
            click() {
                mainWindow.webContents.reload();
            }
        }
    ]
    let mainMenuTmp = Menu.buildFromTemplate(mainMenu);
    Menu.setApplicationMenu(mainMenuTmp); 
});
