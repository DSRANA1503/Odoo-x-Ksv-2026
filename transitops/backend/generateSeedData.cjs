const fs = require('fs');
const path = require('path');

// Helper to generate ObjectIds
const generateObjectId = () => {
    const timestamp = (Math.floor(new Date().getTime() / 1000)).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const numRecords = 120;
const seedDataDir = path.join(__dirname, 'seedData');

const users = [];
const roles = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst", "Admin"];
for (let i = 1; i <= 20; i++) {
    users.push({
        _id: { "$oid": generateObjectId() },
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: "password123", // Assuming plain for seed, or pre-hashed
        role: roles[i % roles.length],
        createdAt: { "$date": new Date().toISOString() },
        updatedAt: { "$date": new Date().toISOString() }
    });
}

const drivers = [];
for (let i = 1; i <= numRecords; i++) {
    drivers.push({
        _id: { "$oid": generateObjectId() },
        name: `Driver ${i}`,
        licenseNumber: `LIC${1000 + i}`,
        licenseCategory: i % 2 === 0 ? "Heavy" : "Medium",
        licenseExpiryDate: { "$date": new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString() },
        contactNumber: `+1800555${(i).toString().padStart(4, '0')}`,
        status: i % 3 === 0 ? "On Trip" : "Available",
        safetyScore: 80 + Math.floor(Math.random() * 20),
        incidents: Math.floor(Math.random() * 3),
        createdAt: { "$date": new Date().toISOString() },
        updatedAt: { "$date": new Date().toISOString() }
    });
}

const vehicles = [];
for (let i = 1; i <= numRecords; i++) {
    vehicles.push({
        _id: { "$oid": generateObjectId() },
        regNo: `TX-${(1000 + i)}`,
        modelName: i % 2 === 0 ? "Volvo VNL" : "Freightliner Cascadia",
        type: i % 3 === 0 ? "Heavy Truck" : "Medium Van",
        capacity: 10000 + Math.floor(Math.random() * 5000),
        odometer: 50000 + Math.floor(Math.random() * 100000),
        acquisitionCost: 120000 + Math.floor(Math.random() * 50000),
        status: i % 3 === 0 ? "On Trip" : "Available",
        region: i % 2 === 0 ? "North America" : "Europe",
        createdAt: { "$date": new Date().toISOString() },
        updatedAt: { "$date": new Date().toISOString() }
    });
}

const trips = [];
const today = new Date();
for (let i = 1; i <= numRecords; i++) {
    const vId = vehicles[Math.floor(Math.random() * vehicles.length)]._id;
    const dId = drivers[Math.floor(Math.random() * drivers.length)]._id;
    
    let tripDate = new Date();
    tripDate.setDate(today.getDate() - Math.floor(Math.random() * 100)); // Spread over last 100 days

    trips.push({
        _id: { "$oid": generateObjectId() },
        vehicleId: vId,
        driverId: dId,
        origin: "New York, NY",
        destination: "Los Angeles, CA",
        plannedDistance: 4500 + Math.floor(Math.random() * 500),
        cargoWeight: 5000 + Math.floor(Math.random() * 5000),
        lifecycleState: i % 5 === 0 ? "Dispatched" : "Completed",
        revenue: 2000 + Math.floor(Math.random() * 3000),
        createdAt: { "$date": tripDate.toISOString() },
        updatedAt: { "$date": tripDate.toISOString() }
    });
}

const fuelLogs = [];
for (let i = 1; i <= numRecords; i++) {
    const vId = vehicles[Math.floor(Math.random() * vehicles.length)]._id;
    let tripDate = new Date();
    tripDate.setDate(today.getDate() - Math.floor(Math.random() * 100));

    fuelLogs.push({
        _id: { "$oid": generateObjectId() },
        vehicleId: vId,
        date: { "$date": tripDate.toISOString() },
        liters: 100 + Math.floor(Math.random() * 200),
        cost: 300 + Math.floor(Math.random() * 500),
        odometerAtFill: 50000 + Math.floor(Math.random() * 10000),
        createdAt: { "$date": tripDate.toISOString() },
        updatedAt: { "$date": tripDate.toISOString() }
    });
}

const expenses = [];
for (let i = 1; i <= numRecords; i++) {
    const vId = vehicles[Math.floor(Math.random() * vehicles.length)]._id;
    let tripDate = new Date();
    tripDate.setDate(today.getDate() - Math.floor(Math.random() * 100));

    expenses.push({
        _id: { "$oid": generateObjectId() },
        vehicleId: vId,
        date: { "$date": tripDate.toISOString() },
        type: i % 2 === 0 ? "Maintenance" : "Insurance",
        amount: 500 + Math.floor(Math.random() * 1500),
        description: "Routine checkup and repair",
        createdAt: { "$date": tripDate.toISOString() },
        updatedAt: { "$date": tripDate.toISOString() }
    });
}

const maintenanceLogs = [];
for (let i = 1; i <= numRecords; i++) {
    const vId = vehicles[Math.floor(Math.random() * vehicles.length)]._id;
    let tripDate = new Date();
    tripDate.setDate(today.getDate() - Math.floor(Math.random() * 100));

    maintenanceLogs.push({
        _id: { "$oid": generateObjectId() },
        vehicleId: vId,
        type: i % 2 === 0 ? "Routine" : "Repair",
        description: "Brake replacement",
        cost: 400 + Math.floor(Math.random() * 600),
        date: { "$date": tripDate.toISOString() },
        performedBy: "Auto Fixers Inc",
        createdAt: { "$date": tripDate.toISOString() },
        updatedAt: { "$date": tripDate.toISOString() }
    });
}

fs.writeFileSync(path.join(seedDataDir, 'users.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'drivers.json'), JSON.stringify(drivers, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'vehicles.json'), JSON.stringify(vehicles, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'trips.json'), JSON.stringify(trips, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'fuelLogs.json'), JSON.stringify(fuelLogs, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'expenses.json'), JSON.stringify(expenses, null, 2));
fs.writeFileSync(path.join(seedDataDir, 'maintenanceLogs.json'), JSON.stringify(maintenanceLogs, null, 2));

console.log('Seed data generated successfully!');
