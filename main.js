const {app, BrowserWindow, ipcMain} = require('electron')
const { exec, execFileSync, execFile } = require('child_process');
const applescript = require('applescript');

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
      

      if( process.platform == 'win32' ){
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
      }


      if( process.platform == 'darwin' ){
        const script = 'tell application "Google Chrome" to return URL of active tab of front window';

        applescript.execString(script, (err, rtn) => {
          if (err) {
            // Something went wrong!
          }
          
          mainWindow.webContents.send('store-data', rtn);
        });
      }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
