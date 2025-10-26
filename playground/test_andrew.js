// Node-RED Function node for GV65/GV56/GL320MG parsing
// Include this entire code in a single function node

// ================= UTILS FUNCTIONS =================
const patterns = {
  buffer: /^\+BUFF/
};

const states = {
  '16': 'Tow',
  '1A': 'Fake Tow',
  '11': 'Ignition Off Rest',
  '12': 'Ignition Off Moving',
  '21': 'Ignition On Rest',
  '22': 'Ignition On Moving',
  '41': 'Sensor Rest',
  '42': 'Sensor Motion',
  '': 'Unknown'
};

const latamMcc = {
  716: 'Perú',
  722: 'Argentina',
  724: 'Brasil',
  730: 'Chile',
  732: 'Colombia',
  736: 'Bolivia',
  740: 'Ecuador',
  744: 'Paraguay',
  748: 'Uruguay',
  default: 'Desconocido'
};

// Convert hex to binary
function hex2bin(num) {
  return parseInt(num, 16).toString(2);
}

// Format binary to n digits
function nHexDigit(num, n) {
  let bin = num.toString();
  while (bin.length < n) {
    bin = `0${bin}`;
  }
  return bin;
}

// Parse date from Queclink format
function parseDate(date) {
  if (!date) return null;
  return new Date(
    `${date.replace(
      /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      '$1-$2-$3T$4:$5:$6'
    )}+00:00`
  );
}

// Check GPS validity
function checkGps(lng, lat) {
  if (lng !== 0 && lat !== 0 && !isNaN(lng) && !isNaN(lat)) {
    return true;
  }
  return false;
}

// Get protocol version
function getProtocolVersion(protocol) {
  let deviceType;
  let deviceVersion;
  
  // Simplified device mapping for your devices
  const devices = {
    '56': 'GV56',
    '65': 'GV65', 
    '32': 'GL320MG'
  };
  
  if (protocol.length >= 2) {
    deviceType = devices[protocol.substring(0, 2)] || 'Unknown';
    deviceVersion = `${parseInt(protocol.substring(2, 4), 16)}.${parseInt(protocol.substring(4, 6), 16)}`;
  } else {
    deviceType = 'Unknown';
    deviceVersion = '0.0';
  }
  
  return {
    raw: protocol,
    deviceType: deviceType,
    version: deviceVersion
  };
}

// Get alarm type
function getAlarm(command, report, extra = false) {
  const alarmTypes = {
    'GTFRI': { type: 'Gps' },
    'GTHBD': { type: 'Heartbeat' },
    'GTINF': { type: 'General_Info_Report' },
    'GTTOW': { type: 'Towing' },
    'GTSOS': { type: 'SOS_Button' },
    'GTSPD': { type: 'Over_Speed' },
    'GTRTL': { type: 'Gps', status: 'Requested' },
    'GTDIS': { type: 'DI' },
    'GTDOG': { type: 'Watchdog_Protocol' },
    'GTPNA': { type: 'Power', status: true },
    'GTPFA': { type: 'Power', status: false },
    'GTBPL': { type: 'Low_Battery' },
    'GTEPS': { type: 'External_Low_battery' },
    'GTAIS': { type: 'AI' }
  };
  
  return alarmTypes[command] || { type: command, message: 'Unknown alarm' };
}

// Get MNC (Mobile Network Code)
function getMNC(mccStr, mncStr) {
  if (!mccStr || !mncStr) return null;
  
  const mcc = parseInt(mccStr, 10);
  const mnc = parseInt(mncStr, 10);
  
  let operator = 'Unknown';
  
  if (mcc === 716) { // Peru
    operator = (mnc === 6) ? 'Movistar' :
              (mnc === 10) ? 'Claro' :
              (mnc === 17) ? 'Entel' : 'Unknown';
  } else if (mcc === 730) { // Chile
    operator = ([1, 10].includes(mnc)) ? 'Entel' :
              ([2, 7].includes(mnc)) ? 'Movistar' :
              ([3, 23].includes(mnc)) ? 'Claro' : 'Unknown';
  }
  // Add more countries as needed
  
  return {
    country: latamMcc[mcc] || latamMcc.default,
    mnc: mnc,
    operator: operator
  };
}

// Get hours from hourmeter
function getHoursForHourmeter(hourmeter) {
  try {
    if (!hourmeter) return null;
    const parts = hourmeter.split(':');
    if (parts.length !== 3) return null;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return hours + (minutes + seconds / 60) / 60;
  } catch (e) {
    return null;
  }
}

// ================= DEVICE-SPECIFIC PARSERS =================
function parseDeviceStatusGV56(hexStr) {
  if (!hexStr) return null;
  const val = parseInt(hexStr, 16);
  const motionHex = hexStr.length >= 2 ? hexStr.slice(0, 2) : null;

  const motionDesc = {
    "16": "Tow (Ignition off, vehicle towed)",
    "1A": "Fake Tow (Ignition off, possible tow)",
    "11": "Ignition Off Rest",
    "12": "Ignition Off Motion",
    "21": "Ignition On Rest",
    "22": "Ignition On Motion",
    "41": "Sensor Rest (no ignition signal)",
    "42": "Sensor Motion (no ignition signal)"
  }[motionHex] || "Unknown";

  const inputStatus = (val >> 4) & 0xF;
  const ignitionInput = inputStatus & 0x1;
  const otherInputs = (inputStatus >> 1) & 0x7;
  const outputStatus = val & 0xF;

  return {
    raw: hexStr,
    motion: { code: motionHex, desc: motionDesc },
    inputs: { raw: inputStatus, ignition: ignitionInput, others: otherInputs },
    outputs: { raw: outputStatus }
  };
}

function parseDeviceStatusGV65(hexStr) {
  if (!hexStr) return null;
  const motion = hexStr.slice(0, 2);
  const motionDesc = {
    "16": "Tow",
    "1A": "Fake Tow",
    "11": "Ignition Off Rest",
    "12": "Ignition Off Motion",
    "21": "Ignition On Rest",
    "22": "Ignition On Motion",
    "41": "Sensor Rest",
    "42": "Sensor Motion"
  }[motion] || "Unknown";

  return { raw: hexStr, motion: { code: motion, desc: motionDesc } };
}

function parseDeviceStatusGL320(hexStr) {
  if (!hexStr) return null;
  const val = parseInt(hexStr, 16);
  
  return {
    raw: hexStr,
    motion: (val & 0x01) ? "Moving" : "Stationary",
    ignition: (val & 0x02) ? "On" : "Off",
    charge: (val & 0x04) ? "Charging" : "Not Charging"
  };
}

// ================= MAIN PARSER =================
function parseQueclinkMessage(raw, deviceType) {
  // Remove trailing $ if present
  raw = raw.toString().trim();
  if (raw.endsWith('$')) {
    raw = raw.substring(0, raw.length - 1);
  }

  const parsedData = raw.split(',');
  const command = parsedData[0].split(':');

  let history = false;
  if (patterns.buffer.test(command[0])) {
    history = true;
  }

  // Detect device type from protocol if not provided
  if (!deviceType) {
    const protocol = getProtocolVersion(parsedData[1]);
    deviceType = protocol.deviceType;
  }

  // Field mapping based on device type
  const getFieldMapping = () => {
    const baseFields = {
      protocolVersion: 1,
      imei: 2,
      deviceName: 3,
      externalPower: 4,
      reportId: 5,
      state: 6,
      hdop: 7,
      speed: 8,
      azimuth: 9,
      altitude: 10,
      longitude: 11,
      latitude: 12,
      datetime: 13,
      mcc: 14,
      mnc: 15,
      lac: 16,
      cellId: 17,
      reserved: 18
    };

    if (deviceType === 'GV56') {
      return {
        ...baseFields,
        mileage: 20,
        hourmeter: 21,
        analogInput: 22,
        reserved2: 23,
        batteryPercentage: 24,
        deviceStatus: 25,
        sendTime: 29,
        countNum: 30
      };
    } else if (deviceType === 'GV65') {
      return {
        ...baseFields,
        mileage: 19,
        hourmeter: 20,
        analogInput: 21,
        reserved2: 22,
        batteryPercentage: 23,
        deviceStatus: 24,
        sendTime: 28,
        countNum: 29
      };
    } else if (deviceType === 'GL320MG') {
      return {
        ...baseFields,
        mileage: 19,
        batteryPercentage: 20,
        deviceStatus: 21,
        sendTime: 25,
        countNum: 26
      };
    }
    return baseFields;
  };

  const fields = getFieldMapping();

  let data = {
    raw: `${raw}$`,
    manufacturer: 'queclink',
    device: deviceType,
    type: 'data',
    imei: parsedData[fields.imei],
    protocolVersion: getProtocolVersion(parsedData[fields.protocolVersion]),
    temperature: null,
    history: history,
    sentTime: parseDate(parsedData[fields.sendTime]),
    serialId: parsedData[fields.countNum] ? parseInt(parsedData[fields.countNum], 16) : null
  };

  // Handle different command types
  if (command[1] === 'GTFRI') {
    // GPS Report
    const deviceStatus = deviceType === 'GV56' ? 
      parseDeviceStatusGV56(parsedData[fields.deviceStatus]) :
      deviceType === 'GV65' ? 
      parseDeviceStatusGV65(parsedData[fields.deviceStatus]) :
      parseDeviceStatusGL320(parsedData[fields.deviceStatus]);

    data = {
      ...data,
      alarm: getAlarm(command[1], null),
      loc: {
        type: 'Point',
        coordinates: [
          parseFloat(parsedData[fields.longitude]), 
          parseFloat(parsedData[fields.latitude])
        ]
      },
      speed: parsedData[fields.speed] !== '' ? parseFloat(parsedData[fields.speed]) : null,
      gpsStatus: checkGps(
        parseFloat(parsedData[fields.latitude]),
        parseFloat(parsedData[fields.longitude])
      ),
      hdop: parsedData[fields.hdop] !== '' ? parseFloat(parsedData[fields.hdop]) : null,
      status: deviceStatus,
      azimuth: parsedData[fields.azimuth] !== '' ? parseFloat(parsedData[fields.azimuth]) : null,
      altitude: parsedData[fields.altitude] !== '' ? parseFloat(parsedData[fields.altitude]) : null,
      datetime: parsedData[fields.datetime] !== '' ? parseDate(parsedData[fields.datetime]) : null,
      voltage: {
        battery: parsedData[fields.batteryPercentage] !== '' ? parseFloat(parsedData[fields.batteryPercentage]) : null,
        inputCharge: parsedData[fields.externalPower] !== '' ? parseFloat(parsedData[fields.externalPower]) / 1000 : null
      },
      mcc: parsedData[fields.mcc] !== '' ? latamMcc[parseInt(parsedData[fields.mcc], 10)] : null,
      mnc: parsedData[fields.mnc] !== '' ? getMNC(parsedData[fields.mcc], parsedData[fields.mnc]) : null,
      lac: parsedData[fields.lac] !== '' ? parseInt(parsedData[fields.lac], 16) : null,
      cid: parsedData[fields.cellId] !== '' ? parseInt(parsedData[fields.cellId], 16) : null,
      odometer: parsedData[fields.mileage] !== '' ? parseFloat(parsedData[fields.mileage]) : null,
      hourmeter: parsedData[fields.hourmeter] !== '' ? getHoursForHourmeter(parsedData[fields.hourmeter]) : null
    };

  } else if (command[1] === 'GTHBD') {
    // Heartbeat
    data = {
      ...data,
      alarm: getAlarm(command[1], null)
    };
  } else if (command[1] === 'GTINF') {
    // General Info
    data = {
      ...data,
      alarm: getAlarm(command[1], null),
      state: states[parsedData[4]]
    };
  } else {
    // Other commands - basic parsing
    data = {
      ...data,
      alarm: getAlarm(command[1], parsedData[5] || null)
    };
  }

  // Validate GPS coordinates
  if (data.loc && data.loc.coordinates) {
    if (
      data.loc.coordinates[0] === 0 ||
      isNaN(data.loc.coordinates[0]) ||
      data.loc.coordinates[1] === 0 ||
      isNaN(data.loc.coordinates[1])
    ) {
      data.loc = null;
    }
  }

  return data;
}



// ================= NODE-RED ENTRY POINT =================
const rawMessage ="+BUFF:GTFRI,C30209,860201067161748,GL320,0,16,1,3,0.0,0,52.9,31.365747,30.122447,20251007125026,0602,0003,539B,0F65,1316.0,70,20251007125026,1A3F$";
let deviceType = msg.deviceType || null; // Optional: pass deviceType in msg

try {
  const parsedData = parseQueclinkMessage(rawMessage, deviceType);
  
  // Create MQTT-friendly output
  msg.payload = {
    T: parsedData.datetime ? Math.floor(parsedData.datetime.getTime() / 1000) : null,
    lat: parsedData.loc ? parsedData.loc.coordinates[1] : null,
    lng: parsedData.loc ? parsedData.loc.coordinates[0] : null,
    hdop: parsedData.hdop ? parseInt(parsedData.hdop) : null,
    alt: parsedData.altitude ? parseFloat(parsedData.altitude) : null,
    kmph: parsedData.speed ? parseFloat(parsedData.speed) : null,
    V: parsedData.voltage?.battery ? parseFloat(parsedData.voltage.battery) : null,
    Odometer: parsedData.odometer ? parseFloat(parsedData.odometer) : null,
    externalVoltage: parsedData.voltage?.inputCharge ? parseFloat(parsedData.voltage.inputCharge) : null,
    ignition: parsedData.status?.motion?.desc?.includes("Ignition On") ? "on" : 
              parsedData.status?.ignition === "On" ? "on" : "off",
    device: parsedData.device,
    alarm: parsedData.alarm?.type || null
  };
  
  msg.parsed = parsedData; // Keep full parsed data
} catch (error) {
  msg.payload = {
    error: "Failed to parse message",
    raw: rawMessage,
    errorMessage: error.toString()
  };
}

console.log(msg);
return msg;