const fs = require('fs');

const users = [];
const roles = ['Driver', 'Fleet Manager', 'Safety Officer', 'Financial Analyst', 'Admin'];
for (let i = 1; i <= 20; i++) {
  users.push({
    name: `User ${i}`,
    email: `user${i}@transitops.com`,
    password: 'password123',
    role: roles[i % roles.length],
    status: 'Active',
    createdAt: new Date().toISOString()
  });
}

const vehicles = [];
const vehicleTypes = ['Bus', 'Van', 'Truck', 'Minibus'];
const statuses = ['Available', 'In Transit', 'Maintenance', 'Out of Service'];
for (let i = 1; i <= 50; i++) {
  vehicles.push({
    registrationNumber: `REG-${1000 + i}`,
    type: vehicleTypes[i % vehicleTypes.length],
    capacity: 20 + (i % 30),
    status: statuses[i % statuses.length],
    lastMaintenance: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    mileage: Math.floor(Math.random() * 100000),
    fuelLevel: Math.floor(Math.random() * 100),
    createdAt: new Date().toISOString()
  });
}

const trips = [];
const tripStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
for (let i = 1; i <= 100; i++) {
  trips.push({
    tripId: `TRP-${10000 + i}`,
    vehicleId: vehicles[i % vehicles.length].registrationNumber,
    driverId: users[i % users.length].email,
    origin: `Station ${String.fromCharCode(65 + (i % 10))}`,
    destination: `Station ${String.fromCharCode(65 + ((i + 3) % 10))}`,
    status: tripStatuses[i % tripStatuses.length],
    startTime: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    endTime: i % 2 === 0 ? new Date(Date.now() + Math.random() * 100000000).toISOString() : null,
    passengers: Math.floor(Math.random() * 40),
    createdAt: new Date().toISOString()
  });
}

const logs = [];
for (let i = 1; i <= 30; i++) {
  logs.push({
    vehicleId: vehicles[i % vehicles.length].registrationNumber,
    description: `Routine maintenance ${i}`,
    cost: Math.floor(Math.random() * 500) + 50,
    date: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    performedBy: 'AutoCare Center',
    createdAt: new Date().toISOString()
  });
}

const incidents = [];
for (let i = 1; i <= 15; i++) {
  incidents.push({
    tripId: trips[i % trips.length].tripId,
    driverId: users[i % users.length].email,
    type: 'Speeding',
    severity: ['Low', 'Medium', 'High'][i % 3],
    description: `Speed exceeded by ${10 + (i % 20)} km/h`,
    date: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    resolved: i % 2 === 0,
    createdAt: new Date().toISOString()
  });
}

const finalData = {
  users,
  vehicles,
  trips,
  maintenance_logs: logs,
  incidents
};

fs.writeFileSync('transitops_dummy_data.json', JSON.stringify(finalData, null, 2));
console.log('Dummy data generated successfully at transitops_dummy_data.json');
