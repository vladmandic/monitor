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

async function sendCoreData() {
  if (!win) return;
  log('send core data');
  const data = {};
  data.system = await si.system();
  data.bios = await si.bios();
  data.baseboard = await si.baseboard();
  data.cpu = await si.cpu();
  data.mem = await si.mem();
  data.memLayout = await si.memLayout();
  data.osInfo = await si.osInfo();
  data.users = await si.users();
  data.diskLayout = await si.diskLayout();
  data.blockDevices = await si.blockDevices();
  data.fsSize = await si.fsSize();
  data.usb = await si.usb();
  data.printer = await si.printer();
  data.audio = await si.audio();
  data.networkInterfaces = await si.networkInterfaces();
  data.wifiConnections = await si.wifiConnections();
  data.bluetoothDevices = await si.bluetoothDevices();
  data.battery = await si.battery();
  win.webContents.send('coreData', data);
}

async function sendPollData() {
  if (!win) return;
  log('send poll data');
  const data = {};
  data.cpuCurrentSpeed = await si.cpuCurrentSpeed();
  data.cpuTemperature = await si.cpuTemperature();
  data.currentLoad = await si.currentLoad();
  data.networkStats = await si.networkStats();
  data.graphics = await si.graphics();
  data.disksIO = await si.disksIO();
  win.webContents.send('pollData', data);
}

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
    win = null;
    app.quit();
  });
  ipcMain.on('requestCoreData', () => sendCoreData()); // get system data and send it to client when requested
  ipcMain.on('requestPollData', () => sendPollData()); // get system data and send it to client when requested
  sendMessage({ ready: true });
}

main();
