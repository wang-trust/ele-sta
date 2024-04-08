// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    newIndexWindow: () => ipcRenderer.send('new-indexwindow'),
    closeWindow: () => ipcRenderer.send('close::window'),
    rightclick: () => ipcRenderer.send('menu::rightclick'),

    // main -> slave
    send2Slave: (value) => ipcRenderer.send('renderer::toslave', value),
    getmaindata:(callback) => ipcRenderer.on('renderer::frommain', (event, value) => {
        callback(value);
    }),
    send2main: (value) => ipcRenderer.send('renderer::tomain', value),
    getslavedata:(callback) => ipcRenderer.on('renderer::fromslave', (event, value) => {
        callback(value);
    }),

    newDialog: (value) => ipcRenderer.send('dialog::new-d', value),

    
})