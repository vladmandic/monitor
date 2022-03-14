const Plotly = require('plotly.js-dist-min');

const maxItems = 10;

const cpu = {
  loadUser: { x: [], y: [], name: 'USER', type: 'bar' },
  loadSystem: { x: [], y: [], name: 'SYSTEM', type: 'bar' },
  loadNice: { x: [], y: [], name: 'NICE', type: 'bar' },
  loadIrq: { x: [], y: [], name: 'IRQ', type: 'bar' },
};

const chartLayout = {
  xaxis: {
    type: 'time',
    autorange: true,
    showgrid: false,
    zeroline: false,
    showline: false,
  },
  yaxis: {
    range: [0, 100],
    showgrid: false,
    zeroline: false,
    showline: false,
    gridcolor: '#444444',
  },
  font: {
    family: 'system-ui',
    color: '#FFFFFF',
  },
  plot_bgcolor: '#222222',
  paper_bgcolor: '#000000',
  margin: { l: 0, r: 0, t: 0, b: 0 },
  barmode: 'stack',
  showlegend: true,
};

const chartOptions = {
  scrollZoom: false,
  responsive: false,
  displaylogo: false,
  displayModeBar: false,
};

function cpuUsageUpdate(data) {
  const el = document.getElementById('chartCPUUsage');
  if (!el || !data.currentLoad) return;
  const dt = new Date();
  const lbl = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
  cpu.loadUser.x.push(lbl);
  if (cpu.loadUser.x.length > maxItems) cpu.loadUser.x.shift();
  cpu.loadUser.y.push(data.currentLoad.currentLoadUser);
  cpu.loadSystem.x.push(lbl);
  cpu.loadSystem.y.push(data.currentLoad.currentLoadSystem);
  cpu.loadNice.x.push(lbl);
  cpu.loadNice.y.push(data.currentLoad.currentLoadNice);
  cpu.loadIrq.x.push(lbl);
  cpu.loadIrq.y.push(data.currentLoad.currentLoadIrq);
  for (const arr of Object.values(cpu)) {
    if (arr.x.length > maxItems) arr.x.shift();
    if (arr.y.length > maxItems) arr.y.shift();
  }
  Plotly.newPlot(el, [cpu.loadIrq, cpu.loadSystem, cpu.loadNice, cpu.loadUser], chartLayout, chartOptions);
}

function cpuUsage() {
  return '<div id="chartCPUUsage" style="width: 300px; height: 200px"></div>';
}

exports.cpuUsage = cpuUsage;
exports.cpuUsageUpdate = cpuUsageUpdate;
