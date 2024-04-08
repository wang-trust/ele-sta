const { shell } = require('electron');


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
        shell.openExternal(url);

    });



})

window.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    window.electronAPI.rightclick();


}, false);

window.electronAPI.getslavedata( (value) => {
    console.log(value);

})



