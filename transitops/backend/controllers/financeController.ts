//@ts-nocheck
import { Request, Response } from "express";
import { FuelLog } from "../models/FuelLog";
import { Expense } from "../models/Expense";

export const getFuelLogs = async (req: Request, res: Response) => {
  try {
    const logs = await FuelLog.find().populate("vehicleId").sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().populate("tripId vehicleId").sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

import { Notification } from "../models/Notification";
export const logFuel = async (req: Request, res: Response) => {
  try {
    const log = new FuelLog(req.body);
    await log.save();
    
    await Notification.create({
      title: "Fuel Logged",
      message: `Logged ${log.liters} liters of fuel for vehicle.`
    });

    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logExpense = async (req: Request, res: Response) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    
    await Notification.create({
      title: "Expense Logged",
      message: `A new ${expense.category} expense was logged.`
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
