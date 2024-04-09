// const { shell } = require('electron');

// const { clipboard } = require("electron");


window.addEventListener('DOMContentLoaded', () => {
    const bBtn = document.querySelector('#btn');
    bBtn.addEventListener('click', () => {
        window.electronAPI.newIndexWindow();
        // window.electronAPI.closeWindow();
    });


    const sendbtn = document.querySelector('#btn1');
    sendbtn.addEventListener('click', () => {
        console.log('btn1');
        window.electronAPI.send2Slave('this from main renderer...');
    });


    const dialogbtn = document.querySelector('#btn2');
    dialogbtn.addEventListener('click', () => {
        console.log('dialogbtn');
        window.electronAPI.newDialog('new dialog...');

    });

    url = 'https://wangtrust.top'

    const shellbtn = document.querySelector('#btn3');
    shellbtn.addEventListener('click', () => {
        console.log('shell');
        // shell.openExternal(url);

    });
    

    // Notification
    const notifbtn = document.querySelector('#btn4');
    notifbtn.addEventListener('click', () => {
        let notiftemp = {
            title: 'goupi Notice',
            body: 'goupi now going',
            icon: 'favicon.ico'
        };
        let mynotif = new window.Notification(notiftemp.title, notiftemp);
        mynotif.onclick = function() {
            console.log('mynotif click event run...');
        };
    });

    // clipboard
    const clipbtn = document.querySelector('#btn5');
    clipbtn.addEventListener('click', () => {
        window.electronAPI.cliptest('12345');
    });
    
    // cmd
    const cmdbtn = document.querySelector('#btn6');
    cmdbtn.addEventListener('click', () => {
        console.log('cmd btn start...');
        let ret = window.electronAPI.cmdtest('cmdbtn');
        ret.then((data) => {
            let utf8decoder = new TextDecoder('gbk');
            console.log(utf8decoder.decode(data));
        });
    });
    
    let vi = document.querySelector('#video1');
    const videobtn = document.querySelector('#btn7');
    videobtn.addEventListener('click', () => {
        console.log('video btn start...');
        let vipath = './victory.mp4';
        vi.innerHTML = `<source src="${vipath}">`;


    });

    vi.onloadedmetadata = () => {
        vi.currentTime = 1;
        const { duration, videoHeight, videoWidth } = vi
        console.log(`${duration}, ${videoHeight}, ${videoWidth}`);

    }




})

window.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    window.electronAPI.rightclick();


}, false);

window.electronAPI.getslavedata( (value) => {
    console.log(value);

})



