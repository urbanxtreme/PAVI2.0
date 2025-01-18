// State management
let houses = [];
let rooms = [];
let devices = [];
let energyChart = null;
let currentRoomId = null;
let expandedHouses = new Set();
let expandedRooms = new Set();

function setCurrentRoom(roomId) {
  currentRoomId = roomId;
}

// Initialize the dashboard
function initDashboard() {
  if (!energyChart) {
    setupChart();
  }
  loadSampleData();
  renderRooms(); // This will now render to the hierarchy-container
  setupEventListeners();
}

function calculateUsage() {
  const usage = parseFloat(document.getElementById("usage").value);
  const hours = parseFloat(document.getElementById("hours").value);

  if (isNaN(usage) || isNaN(hours)) {
    alert("Please enter valid numbers");
    return;
  }

  const dailyCost = usage * 0.12; // Assuming $0.12 per kWh
  const monthlyCost = dailyCost * 30;

  alert(
    `Estimated monthly cost: $${monthlyCost.toFixed(
      2
    )}\nTip: Shifting usage to off-peak hours could save up to 20%`
  );
}

// Get current page URL
const currentLocation = window.location.pathname;

// Get all navigation links
const navLinks = document.querySelectorAll(".nav-links a");

// Remove any existing active classes
navLinks.forEach((link) => {
  link.classList.remove("active");

  // Get the href path
  const linkPath = link.getAttribute("href");

  // If the current page URL includes the link's href, add active class
  if (linkPath && currentLocation.includes(linkPath)) {
    link.classList.add("active");
  }
});

// Setup Chart.js
function setupChart() {
  if (energyChart) {
    energyChart.destroy();
  }

  const ctx = document.getElementById("energyChart").getContext("2d");
  const timeLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(26, 86, 219, 0.4)");
  gradient.addColorStop(1, "rgba(147, 197, 253, 0.0)");

  energyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: "Energy Usage (kW)",
          data: generateData(),
          borderColor: "#1a56db",
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#1a56db",
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#1a56db",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 0.4,
          to: 0.5,
          loop: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#1a56db",
          bodyColor: "#666666",
          bodyFont: {
            size: 14,
          },
          padding: 12,
          borderColor: "#1a56db",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y.toFixed(1)} kW`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f0f0f0",
            drawBorder: false,
          },
          ticks: {
            padding: 10,
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
}

// Generate random data for the chart
function generateData() {
  const points = 7;
  const data = [];
  for (let i = 0; i < points; i++) {
    const base = 40 + Math.sin(i / 2) * 20;
    const value = base + Math.random() * 5;
    data.push(parseFloat(value.toFixed(1)));
  }
  return data;
}

// Load sample data
function loadSampleData() {
  rooms = [
    { id: 1, name: "Living Room" },
    { id: 2, name: "Bedroom" },
    { id: 3, name: "Kitchen" },
  ];

  devices = [
    {
      id: 1,
      name: "Main Light",
      type: "light",
      roomId: 1,
      status: "active",
      power: 60,
    },
    {
      id: 2,
      name: "AC Unit",
      type: "ac",
      roomId: 1,
      status: "inactive",
      power: 1200,
    },
    {
      id: 3,
      name: "Ceiling Fan",
      type: "fan",
      roomId: 2,
      status: "active",
      power: 75,
    },
    {
      id: 4,
      name: "TV",
      type: "tv",
      roomId: 2,
      status: "warning",
      power: 100,
    },
  ];
}

// Render rooms and devices
function renderRooms() {
  const container = document.getElementById("hierarchy-container");
  if (!container) return;

  container.innerHTML = "";

  if (houses.length === 0) {
    container.innerHTML =
      '<div class="empty-message">No houses added yet</div>';
    return;
  }

  houses.forEach((house) => {
    const houseRooms = rooms.filter((room) => room.houseId === house.id);
    const isHouseExpanded = expandedHouses.has(house.id);

    const houseHtml = `
            <div class="house-section">
                <div class="house-header" onclick="toggleHouseContent(${
                  house.id
                })">
                    <span
                        class="editable"
                        onclick="event.stopPropagation()"
                        ondblclick="makeEditable(this, 'house', ${house.id})"
                        style="cursor: text;"
                    >${house.name}</span>
                    <span>+</span>
                </div>
                <div class="house-content ${
                  isHouseExpanded ? "show" : ""
                }" id="house-${house.id}-content">
                    ${houseRooms
                      .map((room) => {
                        const roomDevices = devices.filter(
                          (device) => device.roomId === room.id
                        );
                        const isRoomExpanded = expandedRooms.has(room.id);

                        return `
                            <div class="room-section">
                                <div class="room-header ${
                                  isRoomExpanded ? "active" : ""
                                }" onclick="toggleRoomDevices(${room.id})">
                                    <span class="editable" onclick="event.stopPropagation()" ondblclick="makeEditable(this, 'room', ${
                                      room.id
                                    })">${room.name}</span>
                                    <span>+</span>
                                </div>
                                <ul class="device-list ${
                                  isRoomExpanded ? "show" : ""
                                }" id="room-${room.id}-devices">
                                    ${roomDevices
                                      .map(
                                        (device) => `
                                        <li class="device-item">
                                            <div class="status-indicator ${device.status}"></div>
                                            <span class="editable" ondblclick="makeEditable(this, 'device', ${device.id})">${device.name}</span>
                                        </li>
                                    `
                                      )
                                      .join("")}
                                    <button class="add-button" onclick="showModal('device'); setCurrentRoom(${
                                      room.id
                                    })">
                                        <span>+</span>
                                        Add Device
                                    </button>
                                </ul>
                            </div>
                        `;
                      })
                      .join("")}
                    <button class="add-button" onclick="showModal('room'); setCurrentHouse(${
                      house.id
                    })">
                        <span>+</span>
                        Add Room
                    </button>
                </div>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", houseHtml);
  });

  // Restore expanded states after rendering
  expandedHouses.forEach((houseId) => {
    const houseContent = document.getElementById(`house-${houseId}-content`);
    if (houseContent) {
      houseContent.classList.add("show");
    }
  });

  expandedRooms.forEach((roomId) => {
    const deviceList = document.getElementById(`room-${roomId}-devices`);
    if (deviceList) {
      deviceList.classList.add("show");
      const header = deviceList.previousElementSibling;
      if (header) {
        header.classList.add("active");
      }
    }
  });
}

// Toggle room devices visibility
function toggleRoomDevices(roomId) {
  const deviceList = document.getElementById(`room-${roomId}-devices`);
  const header = deviceList.previousElementSibling;
  deviceList.classList.toggle("show");
  header.classList.toggle("active");

  // Track expanded state
  if (deviceList.classList.contains("show")) {
    expandedRooms.add(roomId);
  } else {
    expandedRooms.delete(roomId);
  }
}

// Toggle device controls
function toggleDeviceControls(deviceId) {
  const controls = document.getElementById(`device-${deviceId}-controls`);
  controls.classList.toggle("show");
}

// Modal functions
function showModal(type) {
  const modal = document.getElementById(`${type}Modal`);
  modal.classList.add("show");
}

function hideModal(type) {
  const modal = document.getElementById(`${type}Modal`);
  modal.classList.remove("show");
}

// Add new room
function addRoom() {
  const nameInput = document.getElementById("roomName");
  const name = nameInput.value.trim();

  if (name) {
    const newRoom = {
      id: rooms.length + 1,
      name: name,
    };

    rooms.push(newRoom);
    renderRooms();
    hideModal("room");
    nameInput.value = "";
    showToast("Room added successfully!");
  }
}

// Add new device
function addDevice() {
  const name = document.getElementById("deviceName").value.trim();
  const type = document.getElementById("deviceType").value;

  if (name && currentRoomId) {
    const newDevice = {
      id: devices.length + 1,
      name: name,
      type: type,
      roomId: currentRoomId,
      status: "inactive",
      power: getDefaultPower(type),
    };

    devices.push(newDevice);
    renderRooms();
    hideModal("device");
    document.getElementById("deviceName").value = "";
    showToast("Device added successfully!");
  }
}

// Update device room select options
function updateDeviceRoomSelect() {
  const select = document.getElementById("deviceRoom");
  if (select) {
    select.innerHTML = rooms
      .map((room) => `<option value="${room.id}">${room.name}</option>`)
      .join("");
  }
}

// Get default power consumption for device type
function getDefaultPower(type) {
  const powers = {
    light: 60,
    ac: 1200,
    fan: 75,
    tv: 100,
  };
  return powers[type] || 50;
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = toast.querySelector(".toast-message");
  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Setup event listeners
function setupEventListeners() {
  const toggleButton = document.querySelector(".toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    toggleButton.style.left = sidebar.classList.contains("collapsed")
      ? "30px"
      : "280px";
  });
}

function loadSampleData() {
  houses = [{ id: 1, name: "My Home" }];

  rooms = [
    { id: 1, name: "Living Room", houseId: 1 },
    { id: 2, name: "Bedroom", houseId: 1 },
    { id: 3, name: "Kitchen", houseId: 1 },
  ];

  devices = [
    {
      id: 1,
      name: "Main Light",
      type: "light",
      roomId: 1,
      status: "active",
      power: 60,
    },
    {
      id: 2,
      name: "AC Unit",
      type: "ac",
      roomId: 1,
      status: "inactive",
      power: 1200,
    },
    {
      id: 3,
      name: "Ceiling Fan",
      type: "fan",
      roomId: 2,
      status: "active",
      power: 75,
    },
    {
      id: 4,
      name: "TV",
      type: "tv",
      roomId: 2,
      status: "warning",
      power: 100,
    },
  ];
}

// Render houses, rooms, and devices
function renderHouses() {
  const container = document.getElementById("houses-container");
  container.innerHTML = "";

  houses.forEach((house) => {
    const houseRooms = rooms.filter((room) => room.houseId === house.id);
    const houseHtml = `
                    <div class="house-section">
                        <div class="house-header" onclick="toggleHouseContent(${
                          house.id
                        })">
                            <span class="editable" onclick="event.stopPropagation()" ondblclick="makeEditable(this, 'house', ${
                              house.id
                            })">${house.name}</span>
                            <span>+</span>
                        </div>
                        <div class="house-content" id="house-${
                          house.id
                        }-content">
                            ${houseRooms
                              .map((room) => {
                                const roomDevices = devices.filter(
                                  (device) => device.roomId === room.id
                                );
                                return `
                                    <div class="room-section">
                                        <div class="room-header" onclick="toggleRoomDevices(${
                                          room.id
                                        })">
                                            <span class="editable" onclick="event.stopPropagation()" ondblclick="makeEditable(this, 'room', ${
                                              room.id
                                            })">${room.name}</span>
                                            <span>+</span>
                                        </div>
                                        <ul class="device-list" id="room-${
                                          room.id
                                        }-devices">
                                            ${roomDevices
                                              .map(
                                                (device) => `
                                                <li class="device-item">
                                                    <div class="status-indicator ${device.status}"></div>
                                                    <span class="editable" ondblclick="makeEditable(this, 'device', ${device.id})">${device.name}</span>
                                                </li>
                                            `
                                              )
                                              .join("")}
                                        </ul>
                                    </div>
                                `;
                              })
                              .join("")}
                            <button class="add-button" onclick="showModal('room'); setCurrentHouse(${
                              house.id
                            })">
                                <span>+</span>
                                Add Room
                            </button>
                        </div>
                    </div>
                `;
    container.insertAdjacentHTML("beforeend", houseHtml);
  });
}

// Toggle house content visibility
function toggleHouseContent(houseId) {
  const content = document.getElementById(`house-${houseId}-content`);
  content.classList.toggle("show");

  // Track expanded state
  if (content.classList.contains("show")) {
    expandedHouses.add(houseId);
  } else {
    expandedHouses.delete(houseId);
  }
}

// Make element editable
function makeEditable(element, type, id) {
  // Prevent editing if already in edit mode
  if (element.querySelector("input")) return;

  const currentName = element.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className = "inline-edit";

  // Save on blur (clicking outside)
  input.onblur = () => {
    const newName = input.value.trim();
    if (newName && newName !== currentName) {
      saveEdit(type, id, newName);
    } else {
      // If empty or unchanged, revert back to original name
      element.textContent = currentName;
    }
  };

  // Save on Enter key press
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      input.blur(); // This will trigger the onblur event
    } else if (e.key === "Escape") {
      element.textContent = currentName; // Revert on Escape
    }
  };

  element.innerHTML = "";
  element.appendChild(input);
  input.focus();
  // Select all text in input
  input.select();
}

function saveEdit(type, id, newName) {
  if (!newName.trim()) return;

  switch (type) {
    case "house":
      houses = houses.map((h) => (h.id === id ? { ...h, name: newName } : h));
      break;
    case "room":
      rooms = rooms.map((r) => (r.id === id ? { ...r, name: newName } : r));
      break;
    case "device":
      devices = devices.map((d) => (d.id === id ? { ...d, name: newName } : d));
      break;
  }

  renderRooms();
  showToast(
    `${type.charAt(0).toUpperCase() + type.slice(1)} renamed successfully!`
  );
}

let currentHouseId = null;

function setCurrentHouse(houseId) {
  currentHouseId = houseId;
}

// Add new house
function addHouse() {
  const nameInput = document.getElementById("houseName");
  const name = nameInput.value.trim();

  if (name) {
    const newHouse = {
      id: houses.length + 1,
      name: name,
    };

    houses.push(newHouse);
    renderRooms(); // Changed from renderHouses() to renderRooms()
    hideModal("house");
    nameInput.value = "";
    showToast("House added successfully!");
  }
}

// Modified add room function
function addRoom() {
  const nameInput = document.getElementById("roomName");
  const name = nameInput.value.trim();

  if (name && currentHouseId) {
    const newRoom = {
      id: rooms.length + 1,
      name: name,
      houseId: currentHouseId,
    };

    rooms.push(newRoom);
    renderRooms(); // Changed from renderHouses() to renderRooms()
    hideModal("room");
    nameInput.value = "";
    showToast("Room added successfully!");
  }
}

function downloadReport(type = "daily") {
  const date = new Date().toLocaleDateString();
  showToast(`Downloading ${type} report for ${date}`);
  // Implement actual download logic here
}

function toggleAllDevices(state) {
  showToast(`Turning ${state} all devices`);
  // Implement device control logic here
}

function scheduleDevices() {
  showModal("schedule");
  // Implement scheduling modal and logic
}

function showEnergyTips() {
  window.location.href = "../newtips/electrictips.html";
}

function showSettings() {
  showModal("settings");
  // Implement settings modal and logic
}

// Enhanced search functionality
document.querySelector(".search-input").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  // Implement search logic here
});
document
  .querySelector(".filter-dropdown")
  .addEventListener("change", function (e) {
    const filterValue = e.target.value;
    // Implement filter logic here
  });
// document.addEventListener('DOMContentLoaded', () => {
//     setupChart();
//     setupEventListeners();
//     renderHierarchy();
// });

//   document.addEventListener("DOMContentLoaded", () => {
//     initDashboard(); // Single initialization point
//     setupEventListeners();
//     renderHierarchy();
//   });

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
  setupEventListeners();
});
