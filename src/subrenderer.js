window.electronAPI.getmaindata( (value) => {
    console.log(value);

})


window.addEventListener('DOMContentLoaded', () => {

    const sendbtn = document.querySelector('#btn1');
    sendbtn.addEventListener('click', () => {
        console.log('btn1');
        window.electronAPI.send2main('this from slave renderer...');
    })
})