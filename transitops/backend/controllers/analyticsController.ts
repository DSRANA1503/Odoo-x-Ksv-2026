//@ts-nocheck
import { Request, Response } from "express";
import { Trip } from "../models/Trip";
import { Expense } from "../models/Expense";
import { FuelLog } from "../models/FuelLog";
import { Vehicle } from "../models/Vehicle";
import { Driver } from "../models/Driver";
import { downloadCsv } from "../utils/csvExporter";
import PDFDocument from "pdfkit";

export const getKPIs = async (req: Request, res: Response) => {
  try {
    const { region, type, status } = req.query;
    let vehicleQuery: any = {};
    if (region) vehicleQuery.region = region;
    if (type) vehicleQuery.type = type;
    if (status) vehicleQuery.status = status;

    const vehicles = await Vehicle.find(vehicleQuery);
    const drivers = await Driver.find();
    const trips = await Trip.find();
    const expenses = await Expense.find();
    const fuelLogs = await FuelLog.find();
    
    // Fleet Manager & Admin
    const activeVehicles = vehicles.filter(v => v.status === "On Trip").length;
    const availableVehicles = vehicles.filter(v => v.status === "Available").length;
    const vehiclesInMaintenance = vehicles.filter(v => v.status === "In Shop").length;
    
    const activeTrips = trips.filter(t => t.lifecycleState === "Dispatched").length;
    const pendingTrips = trips.filter(t => t.lifecycleState === "Draft" || t.lifecycleState === "Scheduled").length;
    
    const driversOnDuty = drivers.filter(d => d.status === "On Trip" || d.status === "Available").length;
    const offDutyDrivers = drivers.filter(d => d.status === "Off Duty").length;
    const totalVehicles = vehicles.filter(v => v.status !== "Retired").length;
    const fleetUtilization = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;
    
    // Financial Analyst
    const totalRevenue = trips.filter(t => t.lifecycleState === "Completed").reduce((acc, t) => acc + (t.revenue || 0), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0) + fuelLogs.reduce((acc, f) => acc + (f.cost || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    
    // Safety Officer
    const averageSafetyScore = drivers.length > 0 ? drivers.reduce((acc, d) => acc + (d.safetyScore || 0), 0) / drivers.length : 0;
    const incidentCount = drivers.reduce((acc, d) => acc + (d.incidents || 0), 0);
    const suspendedDrivers = drivers.filter(d => d.status === "Suspended").length;

    res.json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      offDutyDrivers,
      fleetUtilization: fleetUtilization.toFixed(1),
      totalRevenue,
      totalExpenses,
      netProfit,
      averageSafetyScore: averageSafetyScore.toFixed(1),
      incidentCount,
      suspendedDrivers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleAnalytics = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    const trips = await Trip.find({ lifecycleState: "Completed" } as any);
    const fuelLogs = await FuelLog.find();
    const expenses = await Expense.find();
    
    const analytics = vehicles.map(vehicle => {
      const vTrips = trips.filter(t => String(t.vehicleId) === String(vehicle._id));
      const vFuel = fuelLogs.filter(f => String(f.vehicleId) === String(vehicle._id));
      const vExpenses = expenses.filter(e => String(e.vehicleId) === String(vehicle._id));
      
      const totalDistance = vTrips.reduce((acc, t) => acc + (t.plannedDistance || 0), 0);
      const totalFuelLiters = vFuel.reduce((acc, f) => acc + f.liters, 0);
      const totalFuelCost = vFuel.reduce((acc, f) => acc + f.cost, 0);
      
      const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : 0;
      
      const maintenanceCost = vExpenses.filter(e => e.type === "Maintenance").reduce((acc, e) => acc + e.amount, 0);
      const otherExpenses = vExpenses.filter(e => e.type !== "Maintenance").reduce((acc, e) => acc + e.amount, 0);
      
      const totalOperationalCost = totalFuelCost + maintenanceCost + otherExpenses;
      const totalRevenue = vTrips.reduce((acc, t) => acc + t.revenue, 0);
      
      const roi = vehicle.acquisitionCost > 0 
        ? ((totalRevenue - (maintenanceCost + totalFuelCost)) / vehicle.acquisitionCost) * 100 
        : 0;
        
      return {
        vehicleId: vehicle._id,
        regNo: vehicle.regNo,
        modelName: vehicle.modelName,
        totalDistance,
        totalFuelLiters,
        fuelEfficiency: fuelEfficiency.toFixed(2),
        totalOperationalCost,
        totalRevenue,
        roi: roi.toFixed(2)
      };
    });
    
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const trips = await Trip.find().lean();
    downloadCsv(res, 'trips_report.csv', ['_id', 'vehicleId', 'driverId', 'lifecycleState', 'revenue', 'cargoWeight', 'plannedDistance', 'origin', 'destination'], trips);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripsTrend = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const trips = await Trip.find({
      createdAt: { $gte: startDate }
    });

    // Group by day
    const trend: any = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trend[d.toISOString().split('T')[0]] = 0;
    }

    trips.forEach(t => {
      const dateStr = (t as any).createdAt.toISOString().split('T')[0];
      if (trend[dateStr] !== undefined) {
        trend[dateStr]++;
      }
    });

    const formattedData = Object.keys(trend).map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      trips: trend[date]
    }));

    res.json(formattedData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueTrend = async (req: Request, res: Response) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);

    const trips = await Trip.find({
      createdAt: { $gte: startDate },
      lifecycleState: "Completed"
    });

    const expenses = await Expense.find({
      date: { $gte: startDate }
    });

    const fuelLogs = await FuelLog.find({
      date: { $gte: startDate }
    });

    // Group by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trend: any = {};
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      trend[key] = { name: months[d.getMonth()], revenue: 0, cost: 0 };
    }

    trips.forEach(t => {
      const d = new Date((t as any).createdAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (trend[key]) {
        trend[key].revenue += (t.revenue || 0);
      }
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (trend[key]) {
        trend[key].cost += (e.amount || 0);
      }
    });

    fuelLogs.forEach(f => {
      const d = new Date(f.date);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (trend[key]) {
        trend[key].cost += (f.cost || 0);
      }
    });

    res.json(Object.values(trend));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const exportPDF = async (req: Request, res: Response) => {
  try {
    const doc = new PDFDocument();
    let buffers: any[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=transitops_report.pdf',
      })
      .end(pdfData);
    });

    doc.fontSize(20).text('TransitOps Analytics Report', { align: 'center' });
    doc.moveDown();
    
    // Add some simple text/stats
    doc.fontSize(14).text('Vehicle Summary', { underline: true });
    const vehicles = await Vehicle.find();
    doc.fontSize(10).text(`Total Vehicles: ${vehicles.length}`);
    const activeVehicles = vehicles.filter(v => v.status === "On Trip").length;
    doc.text(`Active on Trip: ${activeVehicles}`);
    doc.moveDown();
    
    doc.fontSize(14).text('Performance Data', { underline: true });
    
    // Just a placeholder since recreating the whole table in pdfkit manually is verbose.
    // I will write out a few key data points.
    const trips = await Trip.find({ lifecycleState: "Completed" } as any);
    const totalRev = trips.reduce((acc, t) => acc + (t.revenue || 0), 0);
    doc.fontSize(10).text(`Completed Trips Revenue: ₹${totalRev.toLocaleString()}`);
    
    doc.end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

