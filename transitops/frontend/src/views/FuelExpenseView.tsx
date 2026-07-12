import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "../utils/formatters";
import RoleWrapper from "../components/rbac/RoleWrapper";
import Loader from "../components/common/Loader";
import FuelModal from "../components/modals/FuelModal";
import ExpenseModal from "../components/modals/ExpenseModal";
import { financeService } from "../api/services";
import { Plus, Droplet, CreditCard, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FuelExpenseView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuelRes, expRes] = await Promise.all([
        financeService.getFuel(),
        financeService.getExpenses()
      ]);
      
      const fuelLogs = fuelRes.data.map((f: any) => ({
        ...f,
        type: "Fuel",
        amount: f.cost,
        notes: `${f.liters}L`
      }));
      
      const expenses = expRes.data.map((e: any) => ({
        ...e,
        notes: e.description || e.type
      }));
      
      const combined = [...fuelLogs, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setItems(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!items.length) return;
    const headers = ["Type", "Amount", "Date", "Vehicle", "Notes"];
    const csvContent = [
      headers.join(","),
      ...items.map(item => [
        item.type,
        item.amount,
        new Date(item.date).toLocaleDateString(),
        item.vehicleId?.regNo || 'Unknown',
        `"${(item.notes || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fuel_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Fuel & Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log and monitor fleet operational costs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export CSV">
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export PDF (Print)">
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
          <RoleWrapper allowedRoles={["Fleet Manager", "Financial Analyst", "Admin"]}>
            <div className="flex flex-col sm:flex-row gap-2 ml-2">
              <button onClick={() => setIsFuelModalOpen(true)} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors shadow-sm active:scale-95">
                 <Droplet className="w-4 h-4 text-blue-500" /> Log Fuel
              </button>
              <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95">
                 <Plus className="w-4 h-4" /> Add Expense
              </button>
            </div>
          </RoleWrapper>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center"><Loader /></td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No records found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'Fuel' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {item.type === 'Fuel' ? <Droplet className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                          </div>
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-semibold">{formatCurrency(item.amount)}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.vehicleId?.regNo || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[250px] truncate" title={item.notes}>{item.notes}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <FuelModal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} onSave={fetchData} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={fetchData} />
    </motion.div>
  );
}
