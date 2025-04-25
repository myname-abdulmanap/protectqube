// Update datetime display
function updateDateTime() {
  const now = new Date();
  const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  };
  document.getElementById('datetime').textContent = now.toLocaleDateString('id-ID', options);
}

// Initial call and set interval
updateDateTime();
setInterval(updateDateTime, 1000);

// Genset and fuel elements
const fuelSlider = document.getElementById('fuel-slider');
const fuelPercentage = document.getElementById('fuel-percentage');
const fuelLevel = document.getElementById('fuel-level');
const fuelMetrics = document.getElementById('fuel-metrics');
const fuelAlert = document.getElementById('fuel-alert');
const statusLight = document.getElementById('status-light');
const engineStatus = document.getElementById('engine-status');

// Buttons
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const refuelBtn = document.getElementById('refuel-btn');

// Stats elements
const runtimeEl = document.getElementById('runtime');
const voltageEl = document.getElementById('voltage');
const powerEl = document.getElementById('power');
const fuelConsumptionEl = document.getElementById('fuel-consumption');
const temperatureEl = document.getElementById('temperature');
const oilPressureEl = document.getElementById('oil-pressure');

// Anomaly detection elements
const anomalyList = document.getElementById('anomaly-list');
const anomalyCount = document.getElementById('anomaly-count');
const lastAnomaly = document.getElementById('last-anomaly');
const securityStatus = document.getElementById('security-status');
const anomalyStatus = document.getElementById('anomaly-status');
const toggleSecurity = document.getElementById('toggle-security');
const thresholdSlider = document.getElementById('threshold-slider');
const thresholdValue = document.getElementById('threshold-value');

// Initialize variables
let isRunning = false;
let runtime = 0;
let anomalyCounter = 0;
let fuelCapacity = 800; // Liters
let normalConsumptionRate = 3600; // L/hour
let sensors = {
  voltage: 0,
  power: 0,
  temperature: 25,
  oilPressure: 0,
  fuelConsumption: 0
};
let securityActive = true;
let fuelHistory = [];
let anomalyThreshold = 2; // Medium
let lastFuelPercentage = 0;
let fuelConsumptionPerSecond = 0;
let fuelConsumptionInterval;
let runtimeInterval;

// Update fuel display from slider
fuelSlider.addEventListener('input', function() {
  updateFuelDisplay(this.value);
});

// Update fuel metrics based on percentage
function updateFuelDisplay(percentage) {
  fuelPercentage.textContent = percentage;
  fuelLevel.style.height = percentage + '%';
  
  const liters = Math.round(fuelCapacity * percentage / 100);
  fuelMetrics.textContent = `${liters} L (${percentage}%)`;
  
  // Show warning if fuel level is low
  if (percentage < 20) {
      fuelAlert.style.display = 'block';
  } else {
      fuelAlert.style.display = 'none';
  }
}

// Engine start button
startBtn.addEventListener('click', function() {
  if (!isRunning) {
      startEngine();
  }
});

// Engine stop button
stopBtn.addEventListener('click', function() {
  if (isRunning) {
      stopEngine();
  }
});

// Refuel button
refuelBtn.addEventListener('click', function() {
  refuel();
});

// Start engine function
function startEngine() {
  isRunning = true;
  statusLight.style.backgroundColor = '#0f0'; // Green light
  statusLight.style.boxShadow = '0 0 10px #0f0';
  engineStatus.textContent = 'RUNNING';
  
  // Start consuming fuel
  startFuelConsumption();
  
  // Initialize sensors
  sensors.voltage = 220 + Math.random() * 20;
  sensors.power = 35 + Math.random() * 10;
  sensors.temperature = 70 + Math.random() * 20;
  sensors.oilPressure = 4 + Math.random() * 1;
  
  updateSensorDisplay();
  
  // Add to log
  const currentFuel = Math.round(fuelCapacity * fuelSlider.value / 100);
  addLogEntry('Genset dihidupkan', currentFuel, 0, 'normal');
}

// Stop engine function
function stopEngine() {
  isRunning = false;
  statusLight.style.backgroundColor = '#ff0'; // Yellow light
  statusLight.style.boxShadow = '0 0 5px #ff0';
  engineStatus.textContent = 'STANDBY';
  
  // Stop fuel consumption
  if (fuelConsumptionInterval) {
      clearInterval(fuelConsumptionInterval);
  }
  
  // Clear runtime interval if it exists
  if (runtimeInterval) {
      clearInterval(runtimeInterval);
  }
  
  // Reset sensors except temperature (which will cool down gradually)
  sensors.voltage = 0;
  sensors.power = 0;
  sensors.fuelConsumption = 0;
  sensors.oilPressure = 0;
  
  updateSensorDisplay();
  
  // Add to log
  const currentFuel = Math.round(fuelCapacity * fuelSlider.value / 100);
  addLogEntry('Genset dimatikan', currentFuel, 0, 'normal');
}

// Refuel function
function refuel() {
  const currentLevel = parseInt(fuelSlider.value);
  const newLevel = Math.min(100, currentLevel + 30); // Add 30% up to max 100%
  fuelSlider.value = newLevel;
  updateFuelDisplay(newLevel);
  
  // Add to log
  const prevFuel = Math.round(fuelCapacity * currentLevel / 100);
  const newFuel = Math.round(fuelCapacity * newLevel / 100);
  const change = newFuel - prevFuel;
  addLogEntry('Pengisian bahan bakar', newFuel, change, 'normal');
}

// Function to start fuel consumption
function startFuelConsumption() {
  // Clear previous intervals if any
  if (fuelConsumptionInterval) clearInterval(fuelConsumptionInterval);
  if (runtimeInterval) clearInterval(runtimeInterval);
  
  // Record current fuel level for history
  const currentLevel = parseInt(fuelSlider.value);
  lastFuelPercentage = currentLevel; // Store initial percentage
  
  fuelHistory.push({
      time: new Date(),
      level: currentLevel,
      operation: 'start'
  });
  
  // Consume fuel every 5 seconds (for simulation)
  fuelConsumptionInterval = setInterval(() => {
    if (!isRunning) return;
    
    const currentLevel = parseInt(fuelSlider.value);
    // Normal consumption is about normalConsumptionRate L/hour, we update every 5 sec
    const consumptionPerInterval = (normalConsumptionRate / 3600) * 5;
    // Convert to percentage based on capacity
    const percentageChange = (consumptionPerInterval / fuelCapacity) * 100;
    
    const newLevel = Math.max(0, currentLevel - percentageChange);
    fuelSlider.value = newLevel;
    updateFuelDisplay(newLevel);
    
    // Calculate and update fuel consumption rate per second
    const totalPercentageChange = lastFuelPercentage - newLevel;
    const secondsElapsed = 5; // Our interval is 5 seconds
    fuelConsumptionPerSecond = totalPercentageChange / secondsElapsed;
    
    // Log the consumption rate with actual negative value for change
    logFuelConsumptionRate(fuelConsumptionPerSecond, newLevel);
    
    // Update for next calculation
    lastFuelPercentage = newLevel;
    
    // Sisanya tetap sama...
      
      // Update consumption rate with slight variations
      sensors.fuelConsumption = normalConsumptionRate + (Math.random() * 2 - 1);
      updateSensorDisplay();
      
      // Record fuel level for history
      fuelHistory.push({
          time: new Date(),
          level: newLevel,
          operation: 'running',
          consumptionPerSecond: fuelConsumptionPerSecond
      });
      
      // If fuel is empty, stop engine
      if (newLevel <= 0) {
          stopEngine();
          addAnomaly('Genset mati - Bahan bakar habis', 'medium');
      }
      
      // Analyze fuel changes for anomalies
      checkForAnomalies();
      
  }, 5000); // Every 5 seconds
  
  // Update runtime counter
  runtimeInterval = setInterval(() => {
      if (!isRunning) return;
      runtime += 1;
      runtimeEl.textContent = (runtime / 3600).toFixed(1); // Convert seconds to hours
      
      // Display current consumption rate per second on UI
      if (document.getElementById('consumption-rate-per-second')) {
          document.getElementById('consumption-rate-per-second').textContent = 
              fuelConsumptionPerSecond.toFixed(4) + '% per detik';
      }
  }, 1000);
}

// New function to log fuel consumption rate
function logFuelConsumptionRate(ratePerSecond, currentLevel) {
  // Calculate actual rate in liters per second
  const literPerSecond = (ratePerSecond / 100) * fuelCapacity;
  
  // Calculate liters consumed since last check (for 5 second interval)
  const litersConsumed = literPerSecond * 5;
  
  // Calculate projected time until empty
  let projectedTimeStr = '-- : -- : --';
  if (literPerSecond > 0) {
    const secondsRemaining = (fuelCapacity * currentLevel / 100) / literPerSecond;
    if (isFinite(secondsRemaining) && secondsRemaining > 0) {
      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = Math.floor(secondsRemaining % 60);
      projectedTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  // Log the consumption rate every log interval
  const activity = `Tingkat konsumsi BBM: ${literPerSecond.toFixed(3)} L/detik (${ratePerSecond.toFixed(4)}%/detik)`;
  
  // Add to log with normal status, but now with negative change
  addLogEntry(activity, Math.round(fuelCapacity * currentLevel / 100), -Math.round(litersConsumed), 'normal');
  
  // Update UI elements with new consumption values
  const fuelRateValue = document.getElementById('fuel-rate-value');
  if (fuelRateValue) {
    fuelRateValue.textContent = `${literPerSecond.toFixed(3)} L/detik`;
  }
  
  const percentRate = document.getElementById('consumption-rate-per-second');
  if (percentRate) {
    percentRate.textContent = `${ratePerSecond.toFixed(4)} %/detik`;
  }
  
  const projectedTime = document.getElementById('projected-time-remaining');
  if (projectedTime) {
    projectedTime.textContent = projectedTimeStr;
  }
}

// Update sensor display
function updateSensorDisplay() {
  voltageEl.textContent = sensors.voltage.toFixed(1);
  powerEl.textContent = sensors.power.toFixed(1);
  temperatureEl.textContent = sensors.temperature.toFixed(1);
  oilPressureEl.textContent = sensors.oilPressure.toFixed(1);
  fuelConsumptionEl.textContent = sensors.fuelConsumption.toFixed(1);
}

// Anomaly detection
function checkForAnomalies() {
  if (!securityActive || fuelHistory.length < 2) return;
  
  // Get last two entries
  const lastEntry = fuelHistory[fuelHistory.length - 1];
  const prevEntry = fuelHistory[fuelHistory.length - 2];
  
  // Calculate time difference in seconds
  const timeDiff = (lastEntry.time - prevEntry.time) / 1000;
  
  // Calculate expected consumption based on engine status
  let expectedChange = 0;
  if (isRunning) {
      // Expected change in percentage for the time period
      expectedChange = (normalConsumptionRate / fuelCapacity) * 100 * (timeDiff / 3600);
  }
  
  // Actual change in percentage
  const actualChange = prevEntry.level - lastEntry.level;
  
  // Determine threshold level based on sensitivity setting
  let thresholdMultiplier;
  switch(anomalyThreshold) {
      case 1: // Low sensitivity
          thresholdMultiplier = 3;
          break;
      case 2: // Medium sensitivity
          thresholdMultiplier = 2;
          break;
      case 3: // High sensitivity
          thresholdMultiplier = 1.5;
          break;
  }
  
  // Check if actual change is significantly more than expected
  if (actualChange > expectedChange * thresholdMultiplier && actualChange > 1) {
      // The '1' ensures we don't trigger on very small changes
      
      // Determine severity
      let severity = 'medium';
      if (actualChange > expectedChange * 3) {
          severity = 'high';
      }
      
      // Calculate amount lost in liters
      const litersLost = (actualChange / 100) * fuelCapacity;
      
      addAnomaly(`Penurunan level BBM yang tidak wajar: -${litersLost.toFixed(1)}L dalam ${timeDiff.toFixed(0)} detik`, severity);
      
      // Add to log with warning status
      const currentFuel = Math.round(fuelCapacity * lastEntry.level / 100);
      const change = -Math.round(litersLost);
      addLogEntry('Penurunan level BBM cepat', currentFuel, change, 'anomaly');
  }
}

// Add anomaly to the list
function addAnomaly(description, severity) {
  // Remove placeholder if present
  const placeholder = anomalyList.querySelector('.placeholder');
  if (placeholder) {
      anomalyList.removeChild(placeholder);
  }
  
  // Create new anomaly item
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  const dateStr = now.toLocaleDateString();
  
  const li = document.createElement('li');
  li.className = `anomaly-item ${severity === 'high' ? 'high' : ''}`;
  
  // Add anomaly time and badge
  const timeDiv = document.createElement('div');
  timeDiv.className = 'anomaly-time';
  timeDiv.textContent = `${dateStr} ${timeStr}`;
  
  const badge = document.createElement('span');
  badge.className = `anomaly-badge ${severity === 'high' ? 'high' : ''}`;
  badge.textContent = severity === 'high' ? 'KRITIS' : 'PERINGATAN';
  
  timeDiv.appendChild(badge);
  li.appendChild(timeDiv);
  
  // Add description
  const descDiv = document.createElement('div');
  descDiv.className = 'anomaly-description';
  descDiv.textContent = description;
  li.appendChild(descDiv);
  
  // Add to list at the top
  anomalyList.insertBefore(li, anomalyList.firstChild);
  
  // Update anomaly metrics
  anomalyCounter++;
  anomalyCount.textContent = anomalyCounter;
  lastAnomaly.textContent = `${timeStr}`;
  
  // Show alert in status area for high severity
  if (severity === 'high') {
      anomalyStatus.classList.add('alert');
      anomalyStatus.querySelector('.status-icon').innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      anomalyStatus.querySelector('.status-text').textContent = 'PERINGATAN! Aktivitas mencurigakan terdeteksi';
  }
}

// Add log entry
function addLogEntry(activity, fuelLevel, change, status = 'normal', timestamp = new Date()) {
  // Format the timestamp
  const formattedTime = timestamp.toLocaleTimeString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Create log entry object
  const logEntry = {
    id: Date.now().toString(),
    activity: activity,
    fuelLevel: fuelLevel,
    change: change,
    status: status,
    timestamp: formattedTime
  };
  
  // Add to log history (we need to ensure logHistory array exists)
  if (!window.logHistory) {
    window.logHistory = [];
  }
  window.logHistory.push(logEntry);
  
  // Update the log table in the UI
  updateLogTable(logEntry);
  
  // Save to local storage
  saveLogToStorage();
  
  return logEntry;
}

// Update the log table with new entry
function updateLogTable(entry) {
  const logTbody = document.getElementById('log-tbody');
  if (!logTbody) return;
  
  // Create a new row
  const row = document.createElement('tr');
  
  // Highlight row if it's an anomaly
  if (entry.status === 'anomaly') {
    row.className = 'highlight-row';
  }
  
  // Format the level value
  const levelPercentage = (entry.fuelLevel / fuelCapacity * 100).toFixed(1);
  
  // Format the change to be user-friendly
  const changeStr = (entry.change >= 0 ? '+' : '') + entry.change + ' L';
  
  // Create the row content
  row.innerHTML = `
    <td>${entry.timestamp}</td>
    <td>${entry.activity}</td>
    <td>${entry.fuelLevel} L (${levelPercentage}%)</td>
    <td>${changeStr}</td>
    <td><span class="status-badge status-${entry.status === 'normal' ? 'normal' : 'danger'}">${entry.status === 'normal' ? 'Normal' : 'Anomali Terdeteksi'}</span></td>
    <td><button class="action-btn" data-id="${entry.id}"><i class="fas fa-eye"></i></button></td>
  `;
  
  // Insert at the top of the table
  if (logTbody.firstChild) {
    logTbody.insertBefore(row, logTbody.firstChild);
  } else {
    logTbody.appendChild(row);
  }
  
  // Limit the number of displayed rows to prevent performance issues (optional)
  const maxRows = 100;
  while (logTbody.children.length > maxRows) {
    logTbody.removeChild(logTbody.lastChild);
  }
  
  // Add event listener to the action button
  const actionBtn = row.querySelector('.action-btn');
  if (actionBtn) {
    actionBtn.addEventListener('click', function() {
      showLogDetails(entry.id);
    });
  }
}

// Save log history to local storage
function saveLogToStorage() {
  try {
    localStorage.setItem('gensetLogHistory', JSON.stringify(window.logHistory));
  } catch (e) {
    console.error('Failed to save log to storage:', e);
    // If localStorage is full, we might want to remove older entries
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      // Remove oldest 20% of entries
      const cutPoint = Math.floor(window.logHistory.length * 0.2);
      window.logHistory = window.logHistory.slice(cutPoint);
      try {
        localStorage.setItem('gensetLogHistory', JSON.stringify(window.logHistory));
      } catch (e2) {
        console.error('Still failed to save log after cleanup:', e2);
      }
    }
  }
}

// Load log history from local storage
function loadLogFromStorage() {
  const savedLog = localStorage.getItem('gensetLogHistory');
  if (savedLog) {
    try {
      window.logHistory = JSON.parse(savedLog);
      
      // Update the table with all logs
      const logTbody = document.getElementById('log-tbody');
      if (logTbody) {
        logTbody.innerHTML = ''; // Clear current logs
        
        // Display most recent logs first
        for (let i = window.logHistory.length - 1; i >= 0; i--) {
          updateLogTable(window.logHistory[i]);
        }
      }
    } catch (e) {
      console.error('Failed to parse log from storage:', e);
      window.logHistory = [];
    }
  } else {
    window.logHistory = [];
  }
}

// Show detailed log entry information
function showLogDetails(logId) {
  const entry = window.logHistory.find(log => log.id === logId);
  if (!entry) return;
  
  // Log to console for debugging
  console.log('Log details:', entry);
  
  // Buat overlay modal
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';
  
  // Buat modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.style.backgroundColor = '#1e293b';
  modalContainer.style.borderRadius = '10px';
  modalContainer.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
  modalContainer.style.width = '500px';
  modalContainer.style.maxWidth = '90%';
  modalContainer.style.maxHeight = '90vh';
  modalContainer.style.overflowY = 'auto';
  modalContainer.style.color = '#e2e8f0';
  modalContainer.style.animation = 'modalFadeIn 0.3s';
  
  // Tambahkan CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  // Header
  const modalHeader = document.createElement('div');
  modalHeader.style.padding = '15px 20px';
  modalHeader.style.borderBottom = '1px solid #334155';
  modalHeader.style.display = 'flex';
  modalHeader.style.justifyContent = 'space-between';
  modalHeader.style.alignItems = 'center';
  
  const headerTitle = document.createElement('h3');
  headerTitle.textContent = 'Detail Log';
  headerTitle.style.margin = '0';
  headerTitle.style.fontSize = '18px';
  headerTitle.style.fontWeight = 'bold';
  headerTitle.style.color = '#f8fafc';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'none';
  closeBtn.style.color = '#94a3b8';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.padding = '0 5px';
  closeBtn.onclick = function() {
    document.body.removeChild(modalOverlay);
  };
  
  modalHeader.appendChild(headerTitle);
  modalHeader.appendChild(closeBtn);
  
  // Body
  const modalBody = document.createElement('div');
  modalBody.style.padding = '20px';
  
  // Timestamp
  const timestampContainer = document.createElement('div');
  timestampContainer.style.marginBottom = '15px';
  timestampContainer.style.borderLeft = '4px solid #0ea5e9';
  timestampContainer.style.padding = '8px 15px';
  timestampContainer.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
  timestampContainer.style.borderRadius = '0 4px 4px 0';
  
  const timestampLabel = document.createElement('div');
  timestampLabel.style.fontSize = '12px';
  timestampLabel.style.textTransform = 'uppercase';
  timestampLabel.style.color = '#7dd3fc';
  timestampLabel.textContent = 'Waktu';
  
  const timestampValue = document.createElement('div');
  timestampValue.style.fontSize = '16px';
  timestampValue.style.fontWeight = '600';
  timestampValue.textContent = entry.timestamp;
  
  timestampContainer.appendChild(timestampLabel);
  timestampContainer.appendChild(timestampValue);
  modalBody.appendChild(timestampContainer);
  
  // Activity
  const activityContainer = document.createElement('div');
  activityContainer.className = 'detail-group';
  activityContainer.style.marginBottom = '15px';
  activityContainer.style.padding = '12px 15px';
  activityContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
  activityContainer.style.borderRadius = '8px';
  
  const activityLabel = document.createElement('div');
  activityLabel.style.fontSize = '12px';
  activityLabel.style.textTransform = 'uppercase';
  activityLabel.style.color = '#94a3b8';
  activityLabel.style.marginBottom = '5px';
  activityLabel.textContent = 'Aktivitas';
  
  const activityValue = document.createElement('div');
  activityValue.style.fontSize = '15px';
  activityValue.style.wordBreak = 'break-word';
  activityValue.textContent = entry.activity;
  
  activityContainer.appendChild(activityLabel);
  activityContainer.appendChild(activityValue);
  modalBody.appendChild(activityContainer);
  
  // Create a row for fuel level and change
  const fuelRow = document.createElement('div');
  fuelRow.style.display = 'flex';
  fuelRow.style.gap = '15px';
  fuelRow.style.marginBottom = '15px';
  
  // Fuel Level
  const fuelLevelContainer = document.createElement('div');
  fuelLevelContainer.style.flex = '1';
  fuelLevelContainer.style.padding = '12px 15px';
  fuelLevelContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
  fuelLevelContainer.style.borderRadius = '8px';
  
  const fuelLevelLabel = document.createElement('div');
  fuelLevelLabel.style.fontSize = '12px';
  fuelLevelLabel.style.textTransform = 'uppercase';
  fuelLevelLabel.style.color = '#94a3b8';
  fuelLevelLabel.style.marginBottom = '5px';
  fuelLevelLabel.textContent = 'Level Bahan Bakar';
  
  const fuelLevelValue = document.createElement('div');
  fuelLevelValue.style.fontSize = '16px';
  fuelLevelValue.style.fontWeight = '600';
  fuelLevelValue.textContent = `${entry.fuelLevel} L`;
  
  fuelLevelContainer.appendChild(fuelLevelLabel);
  fuelLevelContainer.appendChild(fuelLevelValue);
  fuelRow.appendChild(fuelLevelContainer);
  
  // Change
  const changeContainer = document.createElement('div');
  changeContainer.style.flex = '1';
  changeContainer.style.padding = '12px 15px';
  changeContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
  changeContainer.style.borderRadius = '8px';
  
  const changeLabel = document.createElement('div');
  changeLabel.style.fontSize = '12px';
  changeLabel.style.textTransform = 'uppercase';
  changeLabel.style.color = '#94a3b8';
  changeLabel.style.marginBottom = '5px';
  changeLabel.textContent = 'Perubahan';
  
  const changeValue = document.createElement('div');
  changeValue.style.fontSize = '16px';
  changeValue.style.fontWeight = '600';
  // Set color based on positive or negative change
  if (entry.change > 0) {
    changeValue.style.color = '#4ade80'; // Green for positive change
    changeValue.textContent = `+${entry.change} L`;
  } else if (entry.change < 0) {
    changeValue.style.color = '#fb7185'; // Red for negative change
    changeValue.textContent = `${entry.change} L`;
  } else {
    changeValue.textContent = `${entry.change} L`;
  }
  
  changeContainer.appendChild(changeLabel);
  changeContainer.appendChild(changeValue);
  fuelRow.appendChild(changeContainer);
  
  modalBody.appendChild(fuelRow);
  
  // Status
  const statusContainer = document.createElement('div');
  statusContainer.style.padding = '12px 15px';
  statusContainer.style.backgroundColor = entry.status === 'normal' ? 'rgba(20, 83, 45, 0.2)' : 'rgba(153, 27, 27, 0.2)';
  statusContainer.style.borderRadius = '8px';
  statusContainer.style.marginBottom = '10px';
  
  const statusLabel = document.createElement('div');
  statusLabel.style.fontSize = '12px';
  statusLabel.style.textTransform = 'uppercase';
  statusLabel.style.color = '#94a3b8';
  statusLabel.style.marginBottom = '5px';
  statusLabel.textContent = 'Status';
  
  const statusValue = document.createElement('div');
  statusValue.style.fontSize = '16px';
  statusValue.style.fontWeight = '600';
  statusValue.style.color = entry.status === 'normal' ? '#4ade80' : '#f87171';
  
  const statusIcon = document.createElement('span');
  statusIcon.innerHTML = entry.status === 'normal' ? '✓ ' : '⚠ ';
  
  statusValue.appendChild(statusIcon);
  statusValue.appendChild(document.createTextNode(entry.status === 'normal' ? 'Normal' : 'Anomali Terdeteksi'));
  
  statusContainer.appendChild(statusLabel);
  statusContainer.appendChild(statusValue);
  modalBody.appendChild(statusContainer);
  
  // Footer
  const modalFooter = document.createElement('div');
  modalFooter.style.padding = '15px 20px';
  modalFooter.style.borderTop = '1px solid #334155';
  modalFooter.style.textAlign = 'right';
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Tutup';
  closeButton.style.backgroundColor = '#475569';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.padding = '8px 16px';
  closeButton.style.borderRadius = '6px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontWeight = '500';
  closeButton.style.transition = 'background-color 0.2s';
  closeButton.onmouseover = function() {
    this.style.backgroundColor = '#334155';
  };
  closeButton.onmouseout = function() {
    this.style.backgroundColor = '#475569';
  };
  closeButton.onclick = function() {
    document.body.removeChild(modalOverlay);
  };
  
  modalFooter.appendChild(closeButton);
  
  // Assemble modal
  modalContainer.appendChild(modalHeader);
  modalContainer.appendChild(modalBody);
  modalContainer.appendChild(modalFooter);
  modalOverlay.appendChild(modalContainer);
  
  // Add modal to body
  document.body.appendChild(modalOverlay);
  
  // Close modal when clicking outside
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
  
  // Add escape key listener
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.body.contains(modalOverlay)) {
      document.body.removeChild(modalOverlay);
    }
  });
}

// Initialize logs when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadLogFromStorage();
  
  // Add event listener for search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterLogs(this.value);
    });
  }
  
  // Add event listener for export button
  const exportBtn = document.querySelector('.export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportLogs);
  }
  
  // Create UI elements for fuel consumption rate display if they don't exist
  createFuelRateDisplayElements();
});

// Create UI elements for fuel consumption rate if they don't exist
function createFuelRateDisplayElements() {
  // Check if we have a container to add these elements
  const statsContainer = document.querySelector('.stats-container') || document.querySelector('.dashboard-container');
  
  if (statsContainer && !document.getElementById('fuel-rate-display')) {
    // Create container for fuel consumption metrics
    const consumptionContainer = document.createElement('div');
    consumptionContainer.className = 'fuel-consumption-container dashboard-panel';
    consumptionContainer.style.padding = '15px';
    consumptionContainer.style.borderRadius = '8px';
    consumptionContainer.style.background = 'linear-gradient(145deg, #1e293b, #263755)';
    consumptionContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    consumptionContainer.style.marginBottom = '20px';
    
    // Add title
    const titleDiv = document.createElement('div');
    titleDiv.style.fontSize = '16px';
    titleDiv.style.fontWeight = 'bold';
    titleDiv.style.marginBottom = '12px';
    titleDiv.style.color = '#e2e8f0';
    titleDiv.style.borderBottom = '1px solid #475569';
    titleDiv.style.paddingBottom = '8px';
    titleDiv.innerHTML = '<i class="fas fa-gas-pump"></i> MONITOR KONSUMSI BAHAN BAKAR';
    consumptionContainer.appendChild(titleDiv);
    
    // Create fuel rate display element with improved styling
    const fuelRateDiv = document.createElement('div');
    fuelRateDiv.id = 'fuel-rate-display';
    fuelRateDiv.className = 'metric-item';
    fuelRateDiv.style.display = 'flex';
    fuelRateDiv.style.justifyContent = 'space-between';
    fuelRateDiv.style.alignItems = 'center';
    fuelRateDiv.style.marginBottom = '10px';
    fuelRateDiv.style.padding = '8px';
    fuelRateDiv.style.borderRadius = '6px';
    fuelRateDiv.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
    
    const fuelRateLabel = document.createElement('div');
    fuelRateLabel.style.color = '#94a3b8';
    fuelRateLabel.style.fontSize = '14px';
    fuelRateLabel.innerHTML = '<i class="fas fa-tachometer-alt"></i> Tingkat Konsumsi:';
    
    const fuelRateValue = document.createElement('div');
    fuelRateValue.id = 'fuel-rate-value';
    fuelRateValue.style.color = '#38bdf8';
    fuelRateValue.style.fontSize = '16px';
    fuelRateValue.style.fontWeight = 'bold';
    fuelRateValue.style.fontFamily = 'monospace';
    fuelRateValue.textContent = '0.000 L/detik';
    
    fuelRateDiv.appendChild(fuelRateLabel);
    fuelRateDiv.appendChild(fuelRateValue);
    consumptionContainer.appendChild(fuelRateDiv);
    
    // Create percentage display with improved styling
    const percentRateDiv = document.createElement('div');
    percentRateDiv.className = 'metric-item';
    percentRateDiv.style.display = 'flex';
    percentRateDiv.style.justifyContent = 'space-between';
    percentRateDiv.style.alignItems = 'center';
    percentRateDiv.style.marginBottom = '10px';
    percentRateDiv.style.padding = '8px';
    percentRateDiv.style.borderRadius = '6px';
    percentRateDiv.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
    
    const percentRateLabel = document.createElement('div');
    percentRateLabel.style.color = '#94a3b8';
    percentRateLabel.style.fontSize = '14px';
    percentRateLabel.innerHTML = '<i class="fas fa-percentage"></i> Persentase per Detik:';
    
    const percentRateValue = document.createElement('div');
    percentRateValue.id = 'consumption-rate-per-second';
    percentRateValue.style.color = '#38bdf8';
    percentRateValue.style.fontSize = '16px';
    percentRateValue.style.fontWeight = 'bold';
    percentRateValue.style.fontFamily = 'monospace';
    percentRateValue.textContent = '0.0000 %/detik';
    
    percentRateDiv.appendChild(percentRateLabel);
    percentRateDiv.appendChild(percentRateValue);
    consumptionContainer.appendChild(percentRateDiv);
    
    // Create projected time element
    const projectedTimeDiv = document.createElement('div');
    projectedTimeDiv.className = 'metric-item';
    projectedTimeDiv.style.display = 'flex';
    projectedTimeDiv.style.justifyContent = 'space-between';
    projectedTimeDiv.style.alignItems = 'center';
    projectedTimeDiv.style.padding = '8px';
    projectedTimeDiv.style.borderRadius = '6px';
    projectedTimeDiv.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
    
    const projectedTimeLabel = document.createElement('div');
    projectedTimeLabel.style.color = '#94a3b8';
    projectedTimeLabel.style.fontSize = '14px';
    projectedTimeLabel.innerHTML = '<i class="fas fa-hourglass-half"></i> Perkiraan Habis:';
    
    const projectedTimeValue = document.createElement('div');
    projectedTimeValue.id = 'projected-time-remaining';
    projectedTimeValue.style.color = '#fb923c';
    projectedTimeValue.style.fontSize = '16px';
    projectedTimeValue.style.fontWeight = 'bold';
    projectedTimeValue.style.fontFamily = 'monospace';
    projectedTimeValue.textContent = '-- : -- : --';
    
    projectedTimeDiv.appendChild(projectedTimeLabel);
    projectedTimeDiv.appendChild(projectedTimeValue);
    consumptionContainer.appendChild(projectedTimeDiv);
    
    // Add container to stats
    statsContainer.appendChild(consumptionContainer);
  }
}

// Filter logs based on search input
function filterLogs(searchTerm) {
  const logTbody = document.getElementById('log-tbody');
  if (!logTbody) return;
  
  const rows = logTbody.querySelectorAll('tr');
  const term = searchTerm.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
}

// Export logs function
function exportLogs() {
  if (!window.logHistory || window.logHistory.length === 0) {
    alert('No logs to export');
    return;
  }
  
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add CSV header
  csvContent += "Waktu,Aktivitas,Level Bahan Bakar,Perubahan,Status\n";
  
  // Add data rows
  window.logHistory.forEach(log => {
    csvContent += `"${log.timestamp}","${log.activity}","${log.fuelLevel} L","${log.change} L","${log.status}"\n`;
  });
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `genset-logs-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
}

