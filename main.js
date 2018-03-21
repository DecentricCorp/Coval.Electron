'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
const BrowserWindow = electron.BrowserWindow

app.setName(config.productName)




var mainWindow = null
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    title: config.productName,
backgroundColor: '#312450',
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: 'UTF-8'
    }
  })

  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  // Enable keyboard shortcuts for Developer Tools on various platforms.
  let platform = os.platform()
  if (platform === 'darwin') {
    globalShortcut.register('Command+Option+I', () => {
      mainWindow.webContents.openDevTools()
    })
  } else if (platform === 'linux' || platform === 'win32') {
    globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenu(null)
    mainWindow.show()
  })

  mainWindow.onbeforeunload = (e) => {
    // Prevent Command-R from unloading the window contents.
    e.returnValue = false
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const {session} = require('electron')

  // Modify the user agent for all requests to the following urls.
  const filter = {
    urls: ['https://widget.unloq.io/login/*&origin=file*', 'https://widget.unloq.io/register/*&origin=file*', 'http://emblem-alpha.synrgtech.net/?token=*']
  }

  const redir_filter = {urls: ['http://emblem-alpha.synrgtech.net/?token=*']}

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['referer'] = 'https://emblem-alpha.synrgtech.net/'
    callback({cancel: false, requestHeaders: details.requestHeaders})
  })

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    
    var url = ""
    if (details.url.includes('origin')) {
      //console.log("intercepting origin", details.url)
      var pieces = details.url.split("&")
      pieces.forEach(piece=>{
        if (piece.includes('origin')) {          
          url = url + "&origin=https%3A%2F%2Femblem-alpha.synrgtech.net%2F&"
        } else {
          url = url + piece
        }
      })
      return callback({cancel: false, redirectURL: url})
    }
    else if (details.url.includes('token')) {
      //console.log("intercepting token", details.url)
      var pieces = details.url.split("?")
      var uri = `file://${__dirname}/app/index.html?`+ pieces[1]
      //console.log("intercepting to", uri)
      return callback({cancel: false, redirectURL: uri})
    }
    
  })
})

app.on('window-all-closed', () => { app.quit() })