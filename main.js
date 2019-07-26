const {app, BrowserWindow, ipcMain} = require('electron')
const { exec, execFileSync, execFile } = require('child_process');

var mainWindow;

app.on('ready', initialise)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.once('before-quit', () => {
    mainWindow.removeAllListeners('close');
});


function initialise(){

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 500, height: 750})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.once('dom-ready', () => {
      
      setInterval(function(){
        execFile('./bin/win/activetab', (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }

          //send to renderer
          if( mainWindow ){
            mainWindow.webContents.send('store-data', stdout);
          }
        });
      },2000);
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
