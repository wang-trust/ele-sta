const { app, BrowserWindow, ipcMain, Menu } = require('electron');
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

    
    // 自定义菜单
    let menuTemp = [
        { 
            label: 'File',
            submenu: [  // 二级菜单
                {
                    label: '打开文件',
                    click() {  // 添加功能
                        console.log('打开文件');
                    }
                },
                {
                    label: '关闭'
                },
                {
                    type: 'separator'  // 分割线
                },
                {
                    label: '关于',
                    accelerator: 'Ctrl + o',  // 绑定快捷键
                    role: 'about'
                }
            ]
        },
        { label: 'Edit'}
    ]

    let menu = Menu.buildFromTemplate(menuTemp);
    // 添加到应用中
    // Menu.setApplicationMenu(menu);



    // mainWindow.on('ready-to-show', () => { mainWindow.show(); })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    let indexMin;
    ipcMain.on('new-indexwindow', () => {
        indexMin = new BrowserWindow({
            width: 600,
            height: 600,
            // modal: true,
            // parent: mainWindow
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                // nodeIntegration: true,
                // contextIsolation: false
            },
        });
        indexMin.loadFile('src/newindex.html');    
        indexMin.webContents.openDevTools();
        indexMin.on('close', (e) => {
            console.log(e);
            console.log('close now');
            indexMin = null;
        })
    });


    // 自定义右键菜单
    let contextTemp = [
        { label: 'run code'},
        { label: 'test1' },
        { label: 'test4' },
        { 
            label: 'test2',
            click() {
                console.log('menu::rightclick test run ...');
            }
        },
    ];

    // let rightMenu = Menu.buildFromTemplate(contextTemp);

    ipcMain.on('menu::rightclick', () => {
        rightMenu.popup(
            {window: mainWindow}
        )
    });


    ipcMain.on('renderer::toslave', (e, data) => {
        console.log(data);
        indexMin.webContents.send('renderer::frommain', data);
    });

    ipcMain.on('renderer::tomain', (e, data) => {
        console.log(data);
        mainWindow.webContents.send('renderer::fromslave', data);
    });

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



ipcMain.on('close::window', () => {
    // console.log('test');
    console.log('test');
    // let show = dialog.showMessageBox({
    //     // properties: ['']
    //     message: 'test',
    //     type: 'warning',
    //     defaultId: 1,
    //     'buttons': ['cancel','OK', 'No']
    // });
    // show.then((result) => {
    //     console.log(result);
    //     if(result.response === 1){
    //         console.log('关闭')
    //         app.quit();
    //     }
    // });
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
