const process = require('process');
const path = require('path');
const si = require('systeminformation');
const { app, BrowserWindow, ipcMain } = require('electron');

let win;

const log = (str) => {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  process.stdout.write(`${ts}: ${str}\r\n`);
};

const sendMessage = (json) => {
  log(`send message: ${JSON.stringify(json)}\r\n`);
  win.webContents.send('message', json);
};

const sendCoreData = () => {
  log('send core data');
  si.system().then((data) => win.webContents.send('system', data));
  si.bios().then((data) => win.webContents.send('bios', data));
  si.baseboard().then((data) => win.webContents.send('baseboard', data));
  si.cpu().then((data) => win.webContents.send('cpu', data));
  si.mem().then((data) => win.webContents.send('memory', data));
  si.memLayout().then((data) => win.webContents.send('memLayout', data));
  si.osInfo().then((data) => win.webContents.send('osInfo', data));
  si.users().then((data) => win.webContents.send('users', data));
  si.diskLayout().then((data) => win.webContents.send('diskLayout', data));
  si.blockDevices().then((data) => win.webContents.send('blockDevices', data));
  si.fsSize().then((data) => win.webContents.send('fsSize', data));
  si.usb().then((data) => win.webContents.send('usb', data));
  si.printer().then((data) => win.webContents.send('printer', data));
  si.audio().then((data) => win.webContents.send('audio', data));
  si.networkInterfaces().then((data) => win.webContents.send('networkInterfaces', data));
  si.wifiConnections().then((data) => win.webContents.send('wifiConnections', data));
  si.bluetoothDevices().then((data) => win.webContents.send('bluetooth', data));
  si.battery().then((data) => win.webContents.send('battery', data));
};

const sendPollData = () => {
  log('send poll data');
  si.cpuCurrentSpeed().then((data) => win.webContents.send('cpuSpeed', data));
  si.cpuTemperature().then((data) => win.webContents.send('cpuTemp', data));
  si.currentLoad().then((data) => win.webContents.send('currentLoad', data));
  si.networkStats().then((data) => win.webContents.send('networkStats', data));
  si.graphics().then((data) => win.webContents.send('graphics', data));
  si.disksIO().then((data) => win.webContents.send('disksIO', data));
};

const createWindow = () => {
  log('create client');
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: true,
    icon: path.join(__dirname, '/favicon.ico'),
    // frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      devTools: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webgl: false,
      contextIsolation: false,
      nodeIntegration: true,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.removeMenu();
  // win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.openDevTools();
};

async function main() {
  log('start');
  log(`versions: ${JSON.stringify(process.versions)}`);
  if (process.env.WSLENV) {
    log('wsl detected: disabling sandbox and gpu acceleration');
    app.commandLine.appendSwitch('no-sandbox');
    app.disableHardwareAcceleration();
  }
  await app.whenReady();
  log('ready');
  await createWindow();
  app.on('window-all-closed', () => {
    log('close');
    app.quit();
  });
  ipcMain.on('core', () => sendCoreData()); // get system data and send it to client when requested
  ipcMain.on('poll', () => sendPollData()); // get system data and send it to client when requested
  sendMessage({ ready: true });
}

main();
