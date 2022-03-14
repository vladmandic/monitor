const { ipcRenderer } = require('electron');
const renderData = require('./data');

const data = {};

const log = (...msg) => {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  console.log(ts, ...msg);
};

async function renderSection(id) {
  log('render:', { id });
  switch (id) {
    case 'sectionSystemInfo': return renderData.systemInfo(data);
    case 'sectionStorageInfo': return renderData.storageInfo(data);
    case 'sectionOSInfo': return renderData.osInfo(data);
    case 'sectionDisplayInfo': return renderData.displayInfo(data);
    default: return `unknown id: ${id}`;
  }
}

async function flipSection(id, show) {
  log('section:', { id, show });
  if (show) {
    let div = document.getElementById(`section${id}`);
    if (!div) {
      div = document.createElement('span');
      div.id = `section${id}`;
      div.className = 'section';
      document.getElementById('content').appendChild(div);
    }
    div.innerHTML = await renderSection(div.id);
  } else {
    const div = document.getElementById(`section${id}`);
    if (div) document.getElementById('content').removeChild(div);
  }
}

async function refreshAll() {
  ipcRenderer.send('core', {});
  ipcRenderer.send('poll', {});
  setTimeout(async () => {
    log('data:', data);
    const sections = Array.from(document.getElementsByClassName('section'));
    for (const section of sections) section.innerHTML = await renderSection(section.id);
  }, 1000);
}

async function openSettings() {
  //
}

async function flipButton(evt) {
  const el = evt.target;
  const shouldEnable = el.style.backgroundColor === 'rgb(85, 85, 85)';
  el.style.backgroundColor = shouldEnable ? 'rgb(55, 105, 115)' : 'rgb(85, 85, 85)';
  flipSection(el.id.slice(3), shouldEnable);
}

async function main() {
  log('start client');
  const buttons = Array.from(document.getElementsByClassName('button'));
  for (const btn of buttons) {
    log('button:', btn.id);
    btn.style.backgroundColor = 'rgb(85, 85, 85)';
    switch (btn.id) {
      case 'btnRefresh': btn.onclick = () => refreshAll(); break;
      case 'btnSettings': btn.onclick = () => openSettings(); break;
      case 'btnExit': btn.onclick = () => window.close(); break;
      default: btn.onclick = (ev) => flipButton(ev);
    }
  }

  ipcRenderer.on('message', (_event, msg) => log('received message:', msg));
  ipcRenderer.on('system', (_event, msg) => data.system = msg);
  ipcRenderer.on('baseboard', (_event, msg) => data.baseboard = msg);
  ipcRenderer.on('cpu', (_event, msg) => data.cpu = msg);
  ipcRenderer.on('mem', (_event, msg) => data.mem = msg);
  ipcRenderer.on('memLayout', (_event, msg) => data.memLayout = msg);
  ipcRenderer.on('osInfo', (_event, msg) => data.osInfo = msg);
  ipcRenderer.on('users', (_event, msg) => data.users = msg);
  ipcRenderer.on('diskLayout', (_event, msg) => data.diskLayout = msg);
  ipcRenderer.on('blockDevices', (_event, msg) => data.blockDevices = msg);
  ipcRenderer.on('fsSize', (_event, msg) => data.fsSize = msg);
  ipcRenderer.on('usb', (_event, msg) => data.usb = msg);
  ipcRenderer.on('printer', (_event, msg) => data.printer = msg);
  ipcRenderer.on('audio', (_event, msg) => data.audio = msg);
  ipcRenderer.on('networkInterfaces', (_event, msg) => data.networkInterfaces = msg);
  ipcRenderer.on('wifiConnections', (_event, msg) => data.wifiConnections = msg);
  ipcRenderer.on('bluetooth', (_event, msg) => data.bluetooth = msg);
  ipcRenderer.on('battery', (_event, msg) => data.battery = msg);
  ipcRenderer.on('cpuCurrentSpeed', (_event, msg) => data.cpuCurrentSpeed = msg);
  ipcRenderer.on('cpuTemperature', (_event, msg) => data.cpuTemperature = msg);
  ipcRenderer.on('currentLoad', (_event, msg) => data.currentLoad = msg);
  ipcRenderer.on('networkStats', (_event, msg) => data.networkStats = msg);
  ipcRenderer.on('graphics', (_event, msg) => data.graphics = msg);
  ipcRenderer.on('disksIO', (_event, msg) => data.disksIO = msg);

  ipcRenderer.send('core', {});
  ipcRenderer.send('poll', {});
}

window.onload = main;
