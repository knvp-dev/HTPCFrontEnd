const { app, BrowserWindow } = require("electron");
let win;

function createWindow() {
  splash = new BrowserWindow({
    width: 400,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true
    }
  });
  splash.loadFile("app/splash.html");

  win = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    show: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  });
  win.setFullScreen(false);
  win.loadFile("app/index.html");
  win.on("closed", () => {
    win = null;
  });

  // if main window is ready to show, then destroy the splash window and show up the main window
  win.once("ready-to-show", () => {
    setTimeout(() => {
      splash.destroy();
      win.show();
    }, 2000);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
