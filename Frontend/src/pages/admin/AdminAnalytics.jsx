import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { useData } from '../../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, TrendingUp, Leaf, Truck } from 'lucide-react';

export const AdminAnalytics = () => {
  const { environmentalImpact } = useData();

  const monthlyRevenueData = [
    { month: 'Mar', revenue: 145000, orders: 18 },
    { month: 'Apr', revenue: 210000, orders: 24 },
    { month: 'May', revenue: 320000, orders: 35 },
    { month: 'Jun', revenue: 410000, orders: 42 },
    { month: 'Jul', revenue: 580000, orders: 59 },
    { month: 'Aug', revenue: 720000, orders: 74 }
  ];

  const categoryDistribution = [
    { name: 'Plastic', value: environmentalImpact.plasticDivertedKg || 18400, color: '#10B981' },
    { name: 'Paper', value: environmentalImpact.paperRecoveredKg || 14200, color: '#3B82F6' },
    { name: 'E-Waste', value: environmentalImpact.eWasteRecycledKg || 8900, color: '#F59E0B' },
    { name: 'Metal & Scrap', value: 7020, color: '#6B7280' }
  ];

  const transportPerformance = [
    { name: 'TN - Ramesh Transport', trips: 48, rating: 4.9 },
    { name: 'TN - Green Mobility', trips: 32, rating: 4.8 },
    { name: 'KA - Bengaluru Logistics', trips: 65, rating: 4.9 },
    { name: 'MH - Mumbai Eco Fleet', trips: 29, rating: 4.7 }
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Platform Analytics & Eco Metrics" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Top Info Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-lime-400" />
                <span>Pan-India Eco Trading Performance</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Real-time marketplace revenue, waste tonnage diverted, and transport fleet efficiency</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Monthly Platform Revenue (₹ INR)</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">+28% MoM</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Waste Category Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-lime-600" />
                  <span>Waste Diversion by Category (kg)</span>
                </h3>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val.toLocaleString('en-IN')} kg`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fleet Performance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-600" />
                <span>Transportation Fleet Completed Trips</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transportPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trips" fill="#0891b2" name="Completed Deliveries" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
