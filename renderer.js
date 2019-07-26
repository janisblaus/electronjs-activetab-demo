var ipc = require('electron').ipcRenderer;

ipc.on('store-data', function (event,store) {
	var log = document.querySelector(".log");
	log.innerHTML += '<div>' + store + '</div>'
	log.scrollTop = log.scrollHeight;
});

