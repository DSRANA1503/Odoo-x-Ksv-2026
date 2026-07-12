const fs = require('fs');
const crypto = require('crypto');

// Helper to generate a 24-character hex string representing an ObjectId
const generateObjectId = () => crypto.randomBytes(12).toString('hex');

const users = [];
const roles = ['Driver', 'Fleet Manager', 'Safety Officer', 'Financial Analyst', 'Admin'];
for (let i = 1; i <= 20; i++) {
  users.push({
    _id: { $oid: generateObjectId() },
    name: `User ${i}`,
    email: `user${i}@transitops.com`,
    password: 'password123', // usually hashed, but this is dummy data
    role: roles[i % roles.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const drivers = [];
const driverStatuses = ["Available", "On Trip", "Off Duty", "Suspended"];
for (let i = 1; i <= 30; i++) {
  drivers.push({
    _id: { $oid: generateObjectId() },
    name: `Driver ${i}`,
    licenseNumber: `LIC${10000 + i}`,
    licenseCategory: ['Commercial', 'Heavy', 'Light'][i % 3],
    licenseExpiryDate: new Date(Date.now() + Math.random() * 100000000000).toISOString(),
    contactNumber: `+1-555-01${i.toString().padStart(2, '0')}`,
    safetyScore: Math.floor(Math.random() * 20) + 80, // 80-100
    status: driverStatuses[i % driverStatuses.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const vehicles = [];
const vehicleStatuses = ["Available", "On Trip", "In Shop", "Retired"];
for (let i = 1; i <= 50; i++) {
  vehicles.push({
    _id: { $oid: generateObjectId() },
    regNo: `REG-${1000 + i}`,
    modelName: ['Volvo FH16', 'Mercedes Actros', 'Scania R-Series', 'MAN TGX'][i % 4],
    type: ['Heavy Truck', 'Medium Truck', 'Light Van'][i % 3],
    capacity: 5000 + (i * 100),
    odometer: Math.floor(Math.random() * 200000),
    acquisitionCost: 80000 + (i * 1000),
    status: vehicleStatuses[i % vehicleStatuses.length],
    region: ['North America', 'Europe', 'Asia', 'South America'][i % 4],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const trips = [];
const tripLifecycleStates = ["Draft", "Dispatched", "Completed", "Cancelled"];
for (let i = 1; i <= 100; i++) {
  const v = vehicles[i % vehicles.length];
  const d = drivers[i % drivers.length];
  trips.push({
    _id: { $oid: generateObjectId() },
    vehicleId: v._id,
    driverId: d._id,
    lifecycleState: tripLifecycleStates[i % tripLifecycleStates.length],
    cargoWeight: Math.floor(Math.random() * 4000) + 1000,
    plannedDistance: Math.floor(Math.random() * 800) + 100,
    revenue: Math.floor(Math.random() * 5000) + 500,
    origin: `City ${String.fromCharCode(65 + (i % 10))}`,
    destination: `City ${String.fromCharCode(65 + ((i + 5) % 10))}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const expenses = [];
const expenseTypes = ["Toll", "Maintenance", "Misc"];
for (let i = 1; i <= 80; i++) {
  const v = vehicles[i % vehicles.length];
  const t = trips[i % trips.length];
  expenses.push({
    _id: { $oid: generateObjectId() },
    tripId: t._id,
    vehicleId: v._id,
    type: expenseTypes[i % expenseTypes.length],
    amount: Math.floor(Math.random() * 300) + 20,
    description: `Expense ${i} generated`,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const fuelLogs = [];
for (let i = 1; i <= 120; i++) {
  const v = vehicles[i % vehicles.length];
  const liters = Math.floor(Math.random() * 200) + 50;
  fuelLogs.push({
    _id: { $oid: generateObjectId() },
    vehicleId: v._id,
    liters,
    cost: liters * 1.5,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const maintenanceLogs = [];
const maintenanceStatuses = ["In Progress", "Completed"];
for (let i = 1; i <= 40; i++) {
  const v = vehicles[i % vehicles.length];
  maintenanceLogs.push({
    _id: { $oid: generateObjectId() },
    vehicleId: v._id,
    description: `Routine Service ${i}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    cost: Math.floor(Math.random() * 2000) + 200,
    status: maintenanceStatuses[i % maintenanceStatuses.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const finalData = {
  users,
  drivers,
  vehicles,
  trips,
  expenses,
  fuelLogs,
  maintenanceLogs
};

fs.writeFileSync('transitops_mongo_dummy_data.json', JSON.stringify(finalData, null, 2));
console.log('Dummy data generated successfully at transitops_mongo_dummy_data.json');
