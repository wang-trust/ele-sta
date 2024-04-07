
window.addEventListener('DOMContentLoaded', () => {
    const bBtn = document.querySelector('#btn');
    bBtn.addEventListener('click', () => {
        window.electronAPI.newIndexWindow();
        // window.electronAPI.closeWindow();
    });
})

window.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    window.electronAPI.rightclick();


}, false);