import { app, BrowserWindow, ipcMain, net } from "electron";
import * as path from "path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;
let uploadViewWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../static/index.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const createUploadViewWindow = (): void => {
  // Create the detail view window.
  uploadViewWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 400,
    autoHideMenuBar: true,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  uploadViewWindow.loadFile(path.join(__dirname, "../static/uploadView.html"));
  uploadViewWindow.once("ready-to-show", () => {
    uploadViewWindow.show();
  });

  // uploadViewWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

ipcMain.on("uploadView", (event) => {
  createUploadViewWindow();
  uploadViewWindow.webContents.once("did-finish-load", () => {
    event.returnValue = uploadViewWindow.webContents.id;
  });
});

ipcMain.on("upload", (event, requestBody: string) => {
  const request = net.request({
    method: "POST",
    url: "http://3.231.248.158:1337/cap-builds",
  });
  request.setHeader("Content-Type", "application/json"); // Real important
  request.write(requestBody);
  request.on("response", (response) => {
    response.on("data", (chunk) => {
      const rBody = chunk.toString();
      const uid = JSON.parse(rBody).id;
      event.returnValue = uid;
      // console.log(uid);
    });
  });
  request.end();
  
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
