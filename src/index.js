const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { dialog } = require('electron');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // show: false,
        // resizable: false,
        // title: 'goupi',  // 设置窗口标题
        // icon: '123.png',  // 设置窗口图标
        // frame: true,  // 用于自定义menu
        // transparent: true, // 透明设置
        // autoHideMenuBar: true, // 设置窗口的菜单栏
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // nodeIntegration: true,
            // contextIsolation: false
        },
    });

    // mainWindow.on('ready-to-show', () => { mainWindow.show(); })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

ipcMain.on('new-indexwindow', () => {
    let indexMin = new BrowserWindow({
        width: 200,
        height: 200
    });
    indexMin.loadFile('src/newindex.html');

    indexMin.on('close', () => {
        console.log('close now');
        indexMin = null;
    })
});

ipcMain.on('close::window', () => {
    let show = dialog.showMessageBox({
        // properties: ['']
        message: 'test',
        type: 'warning',
        defaultId: 1,
        'buttons': ['cancel','OK', 'No']
    });
    show.then((result) => {
        console.log(result);
        if(result.response === 1){
            console.log('关闭')
            app.quit();
        }
    });
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
