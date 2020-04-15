const { ipcRenderer } = require('electron');

ipcRenderer.on('mainprocess-response', (event, arg) => {
    window.location.href = "../../index.html";
});