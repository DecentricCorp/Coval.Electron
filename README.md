## Emblem Alpha Client **[Desktop Edition]**

### Prerequisites
```
npm install
npm install electron-installer-dmg -g
npm install electron-packager -g
git checkout https://github.com/DecentricCorp/Coval.Electron.git
cd Coval.Electron
git checkout https://github.com/DecentricCorp/Coval.Client.git app
```

### Build .app and Installer for OSX
```
npm run dist-mac
```

### Build .binary for linux
```
npm run package-linux
```

### TODO: Installer for Windows

https://www.christianengvall.se/electron-windows-installer/