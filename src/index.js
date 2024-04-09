const { app, BrowserWindow, ipcMain, Menu, globalShortcut, clipboard } = require('electron');
const path = require('node:path');
const { dialog } = require('electron');
const { spawn } = require('node:child_process');



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
            // nodeIntegration: true,
            // contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
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


    // dialog 相关
    ipcMain.on('dialog::new-d', (e, value) => {
        console.log('new dialog');

        let newDialog = dialog.showOpenDialog({
            buttonLabel: 'Please Select',
            title: 'goupi',
            properties: ['openFile', 'multiSelections'],
            filters: [
                { 'name': '代码文件', extensions: ['js', 'json']},
                { 'name': '图片文件', extensions: ['jpg', 'png']},
            ]
        });
        newDialog.then((ret) => {
            console.log(ret);
        });
    });

    ipcMain.on('clip::writetext', (e, value) => {
        console.log('clipboard test');
        clipboard.writeText(value);
    });
    

    ipcMain.handle('cmd::runls', (e, value) => {
        console.log('cmd test');

        const ls = spawn( 'dir', {
            encoding: 'utf-8',
            cwd: process.cwd(),
            shell: true
        });

        let p = new Promise((resolve, reject) => {
            let ret;
            let d;
            ls.stdout.on('data', (data) => {
                d = data;
                // resolve(d);
            });
            
            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
                d =  `stderr: ${data}`;
                // resolve(d);
            });
            ls.on('close', (code) => {
                console.log(`process close: ${code}`);
                resolve(d);  // 返回完整的处理结果
            })
        })

        return p;
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


// 注册全局快捷键
app.on('ready', () => {
    let ret = globalShortcut.register('ctrl + q', () => {
        console.log('register succeed...');
    })
    if(!ret){
        console.log('register failed...')
    }
})

// 取消全局快捷键
app.on('will-quit', () => {
    globalShortcut.unregister('ctrl + q');
})



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
