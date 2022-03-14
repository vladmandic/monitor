function systemInfo(data) {
  const system = !data.system ? '' : `${data.system.manufacturer} | ${data.system.model}`;
  const baseboard = !data.baseboard ? '' : `${data.baseboard.manufacturer} | ${data.baseboard.model}`;
  const cpu = !data.cpu ? '' : `${data.cpu.brand} | ${data.cpu.speed} Ghz | ${data.cpu.physicalCores} cores | ${data.cpu.cores} threads`;
  const memCapacity = data.memLayout?.reduce((prev, curr) => prev += curr.size, 0) || 0;
  const memDetails = !data.memLayout ? '' : `${data.memLayout.length} x ${data.memLayout[0].type} @ ${data.memLayout[0].clockSpeed} Mhz`;
  const html = `
    <b>SYSTEM</b> &nbsp&nbsp ${system}<br>
    <b>MOTHERBOARD</b> &nbsp&nbsp ${baseboard}<br>
    <b>MEMORY</b> &nbsp&nbsp ${memCapacity / 1024 / 1024} MB | ${memDetails}<br>
    <b>CPU</b> &nbsp&nbsp ${cpu}<br>
  `;
  return html;
}

function storageInfo(data) {
  const disks = data.diskLayout?.map((disk) => `&#11200 ${disk.vendor} | ${disk.name} | type ${disk.type} | interface ${disk.interfaceType} | ${Math.round(disk.size / 1024 / 1024 / 1024)} GB`) || [];
  const fs = data.fsSize?.map((f) => `&#11200 ${f.fs} | type ${f.type} | size ${Math.round(f.size / 1024 / 1024 / 1024)} GB | used ${f.use}%`) || [];
  const html = `
    <b>DEVICES</b><br>
    ${disks.join('<br>')}<br>
    <b>FILESYSTEMS</b><br>
    ${fs.join('<br>')}<br>
  `;
  return html;
}

function osInfo(data) {
  const html = `
    <b>OS</b> &nbsp&nbsp ${data.osInfo?.distro}<br>
    <b>VERSION</b> &nbsp&nbsp ${data.osInfo?.release} | BUILD ${data.osInfo?.build}<br>
    <b>PLATFORM</b> &nbsp&nbsp ${data.osInfo?.platform} | ARCH ${data.osInfo?.arch}<br>
  `;
  return html;
}

function displayInfo(data) {
  const gpus = data.graphics?.controllers?.map((ctrl) => `&#11200 ${ctrl.model} | ${ctrl.name} | ${ctrl.vram} MB | driver ${ctrl.driverVersion}`) || [];
  const displays = data.graphics?.displays?.map((display) => `&#11200 ${display.vendor} ${display.model} | resolution ${display.resolutionX} x ${display.resolutionY} | scale ${Math.round(100 * display.resolutionX / display.currentResX)}%`) || [];
  const html = `
    <b>ADAPTERS</b><br>
    ${gpus.join('<br>')}<br>
    <b>DISPLAYS</b><br>
    ${displays.join('<br>')}<br>
  `;
  return html;
}

exports.systemInfo = systemInfo;
exports.storageInfo = storageInfo;
exports.osInfo = osInfo;
exports.displayInfo = displayInfo;
