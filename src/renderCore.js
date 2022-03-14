function systemInfo(data) {
  const memCapacity = data.memLayout?.reduce((prev, curr) => prev += curr.size, 0) || 0;
  const memDetails = !data.memLayout ? '' : `${data.memLayout.length} x ${data.memLayout[0].type} @ ${data.memLayout[0].clockSpeed} Mhz`;
  const html = `
    <div class="title">SYSTEM INFO</div>
    <table>
      <tr><td><b>SYSTEM</b></td><td>${data.system?.manufacturer} | ${data.system?.model}</td></tr>
      <tr><td><b>CPU</b></td><td>${data.cpu?.brand} | ${data.cpu?.speed} Ghz | ${data.cpu?.physicalCores} cores | ${data.cpu?.cores} threads</td></tr>
      <tr><td><b>MEMORY</b></td><td>${memCapacity / 1024 / 1024} MB | ${memDetails}</td></tr>
      <tr><td><b>MOTHERBOARD</b></td><td>${data.baseboard?.manufacturer} | ${data.baseboard?.model}</td></tr>
      <tr><td><b>BIOS</b></td><td>${data.bios?.vendor} | version ${data.bios?.version} | ${data.bios?.releaseDate}</td></tr>
    </table>
  `;
  return html;
}

function storageInfo(data) {
  const disks = data.diskLayout?.map((disk) => `<tr><td>${disk.name}</td><td>${disk.vendor}</td><td>${disk.type}</td><td>${disk.interfaceType}</td><td>${Math.round(disk.size / 1024 / 1024 / 1024)} GB</td></tr>`) || [];
  const fs = data.fsSize?.map((f) => `<tr><td>${f.fs}</td><td>${f.type}</td><td>${Math.round(f.size / 1024 / 1024 / 1024)} GB</td><td>${f.use}%</td></tr>`) || [];
  const html = `
    <div class="title">STORAGE INFO</div>
    <table>
      <tr><th>DEVICE</th><th>VENDOR</th><th>TYPE</th><th>INTERFACE</th><th>CAPACITY</th></tr>
      ${disks.join('')}
    </table>
    <br>
    <table>
      <tr><th>FILESYSTEM</th><th>TYPE</th><th>SIZE</th><th>USED</th></tr>
      ${fs.join('')}
    </table>
  `;
  return html;
}

function osInfo(data) {
  const html = `
    <div class="title">OS INFO</div>
    <table>
      <tr><td><b>OS</b></td><td>${data.osInfo?.distro}</td></tr>
      <tr><td><b>RELEASE</b></td><td>${data.osInfo?.release}</td></tr>
      <tr><td><b>BUILD</b></td><td>${data.osInfo?.build}</td></tr>
      <tr><td><b>PLATFORM</b></td><td>${data.osInfo?.platform}</td></tr>
      <tr><td><b>ARCH</b></td><td>${data.osInfo?.arch}</td></tr>
      <tr><td><b>HOSTNAME</b></td><td>${data.osInfo?.hostname}</td></tr>
      <tr><td><b>USER</b></td><td>${data.users?.[0].user}</td></tr>
    </table>
  `;
  return html;
}

function batteryInfo(data) {
  // "designedCapacity": 0, "maxCapacity": 0, "currentCapacity": 0, "voltage": 0, "capacityUnit": "", "percent": 0, "timeRemaining": null, "type": "", "model": "", "manufacturer": ""
  const html = `
    <div class="title">BATTERY INFO</div>
    <table>
      <tr><td><b>BATTERY</b></td><td>${data.battery?.hasBattery}</td></tr>
      <tr><td><b>CYCLES</b></td><td>${data.battery?.cycleCount}</td></tr>
      <tr><td><b>CHARGING</b></td><td>${data.battery?.isCharging}</td></tr>
      <tr><td><b>AC POWER</b></td><td>${data.battery?.acConnected}</td></tr>
      <tr><td><b>BATTERY</b></td><td>${data.battery?.hasBattery}</td></tr>
    </table>
  `;
  return html;
}

function displayInfo(data) {
  const gpus = data.graphics?.controllers?.map((ctrl) => `<tr><td>${ctrl.name}</td><td>${ctrl.model}</td><td>${ctrl.vram} MB</td><td>${ctrl.driverVersion}</td></tr>`) || [];
  const displays = data.graphics?.displays?.map((display) => `<tr><td>${display.vendor}</td><td>${display.model}</td><td>${display.resolutionX} x ${display.resolutionY}</td><td>${Math.round(100 * display.resolutionX / display.currentResX)}%</td></tr>`) || [];
  const html = `
    <div class="title">GRAPHICS INFO</div>
    <table>
      <tr><th>ADAPTER</th><th>MODEL</th><th>VRAM</th><th>DRIVER</th></tr>
      ${gpus.join('')}
    </table>
    <br>
    <table>
      <tr><th>DISPLAY</th><th>MODEL</th><th>RESOLUTION</th><th>SCALE</th></tr>
      ${displays.join('')}
    </table>
  `;
  return html;
}

function usbInfo(data) {
  const devs = data.usb?.map((dev) => `<tr><td>${dev.type}</td><td>${dev.name}</td></tr>`) || [];
  const html = `
    <div class="title">USB DEVICES</div>
    <table>
      ${devs.join('')}
    </table>
  `;
  return html;
}

function bluetoothInfo(data) {
  const devs = data.bluetoothDevices?.map((dev) => `<tr><td>${dev.name}</td></tr>`) || [];
  const html = `
    <div class="title">BLUETOOTH DEVICES</div>
    <table>
      ${devs.join('')}
    </table>
  `;
  return html;
}

function audioInfo(data) {
  const devs = data.audio?.map((dev) => `<tr><td>${dev.name}</td></tr>`) || [];
  const html = `
    <div class="title">AUDIO DEVICES</div>
    <table>
      ${devs.join('')}
    </table>
  `;
  return html;
}

function printerInfo(data) {
  const devs = data.printer?.map((dev) => `<tr><td>${dev.name}</td><td>${dev.status}</td><td>${dev.name}</td><td>${dev.local ? 'local' : 'network'}</td><td>${dev.default ? 'default' : ''}</td></tr>`) || [];
  const html = `
    <div class="title">PRINTER INFO</div>
    <table>
      <tr><th>DEVICE</th><th>STATUS</th><th>DEVICE</th><th>LOCATION</th><th></th></tr>
      ${devs.join('')}
    </table>
  `;
  return html;
}

function networkInfo(data) {
  const devs = data.networkInterfaces?.map((dev) => `
    <tr><td>${dev.ifaceName}</td><td>${dev.type}</td><td>${dev.operstate === 'up' ? dev.speed + ' Mbps' : ''}</td><td>${dev.ip4}</td><td>${dev.default ? 'default ' : ''}${dev.internal ? 'internal ' : ''}${dev.virtual ? 'virtual' : ''}</td></tr>
  `) || [];
  const html = `
    <div class="title">NETWORK DEVICE INFO</div>
    <table>
      <tr><th>DEVICE</th><th>TYPE</th><th>LINK</th><th>ADDRESS</th><th>FLAGS</th></tr>
      ${devs.join('')}
    </table>
  `;
  return html;
}

exports.systemInfo = systemInfo;
exports.storageInfo = storageInfo;
exports.osInfo = osInfo;
exports.displayInfo = displayInfo;
exports.usbInfo = usbInfo;
exports.bluetoothInfo = bluetoothInfo;
exports.audioInfo = audioInfo;
exports.printerInfo = printerInfo;
exports.networkInfo = networkInfo;
exports.batteryInfo = batteryInfo;
