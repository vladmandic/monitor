const { ipcRenderer } = require('electron');

const log = (...msg) => {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  console.log(ts, ...msg);
};

async function main() {
  log('start client');
  ipcRenderer.on('message', (_event, data) => log('received message:', data));
  ipcRenderer.on('system', (_event, data) => log('system:', data));
  ipcRenderer.send('core', {});
  ipcRenderer.send('poll', {});
}

window.onload = main;
