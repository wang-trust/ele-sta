
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
    })
})

window.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    window.electronAPI.rightclick();


}, false);

window.electronAPI.getslavedata( (value) => {
    console.log(value);

})