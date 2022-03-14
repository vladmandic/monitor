const { ipcRenderer } = require('electron');
const renderCore = require('./renderCore');
const renderPoll = require('./renderPoll');

let data = {};

const log = (...msg) => {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  console.log(ts, ...msg);
};

async function renderSection(id) {
  switch (id) {
    case 'sectionSystemInfo': return renderCore.systemInfo(data);
    case 'sectionStorageInfo': return renderCore.storageInfo(data);
    case 'sectionOSInfo': return renderCore.osInfo(data);
    case 'sectionDisplayInfo': return renderCore.displayInfo(data);
    case 'sectionUSBInfo': return renderCore.usbInfo(data);
    case 'sectionBluetoothInfo': return renderCore.bluetoothInfo(data);
    case 'sectionAudioInfo': return renderCore.audioInfo(data);
    case 'sectionPrinterInfo': return renderCore.printerInfo(data);
    case 'sectionNetworkInfo': return renderCore.networkInfo(data);
    case 'sectionBatteryInfo': return renderCore.batteryInfo(data);
    case 'sectionCPUUsage': return renderPoll.cpuUsage();
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

async function flipButton(evt) {
  const el = evt.target;
  const shouldEnable = el.style.backgroundColor === 'rgb(85, 85, 85)';
  el.style.backgroundColor = shouldEnable ? 'rgb(55, 105, 115)' : 'rgb(85, 85, 85)';
  flipSection(el.id.slice(3), shouldEnable);
}

async function refreshAll() {
  // request new data via ipc message // repaint is handled on ipc callback
  ipcRenderer.send('requestCoreData', {});
  ipcRenderer.send('requestPollData', {});
}

async function updateData(msg) {
  data = { ...data, ...msg };
  log('update data:', data);
  const sections = Array.from(document.getElementsByClassName('section'));
  for (const section of sections) section.innerHTML = await renderSection(section.id);
}

async function updateCharts() {
  log('update charts');
  renderPoll.cpuUsageUpdate(data);
}

async function openSettings() {
  //
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
  ipcRenderer.on('coreData', async (_event, msg) => {
    await updateData(msg);
  });
  ipcRenderer.on('pollData', async (_event, msg) => {
    await updateData(msg);
    await updateCharts();
  });
  ipcRenderer.send('requestCoreData', {});
  setInterval(() => {
    ipcRenderer.send('requestPollData', {});
  }, 500);
}

window.onload = main;
