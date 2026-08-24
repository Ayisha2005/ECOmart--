import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { BarChart3, TrendingUp, CheckCircle2, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ManagerReportsPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myOrders = orders.filter(o => o.transportCompanyId === companyId);

  const performanceData = [
    { name: 'Driver Ramesh', completed: 48, rating: 4.9 },
    { name: 'Driver Suresh', completed: 32, rating: 4.8 },
    { name: 'Driver Arjun', completed: 65, rating: 4.9 }
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Company Logistics Performance & Reports" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>{currentUser?.companyName || 'Logistics Partner'} Analytics</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Fleet utilization, driver performance ratings, and delivery success metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Pickup Success Rate</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">99.4%</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">On-Time Pickups</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Average Delivery Time</p>
              <h3 className="text-3xl font-extrabold text-cyan-700 mt-1">4.2 Hours</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Urban Eco Corridors</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Orders Handled</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{myOrders.length + 42} Orders</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">ECO MART Verified</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900">Driver Delivery Completion Analytics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#0891b2" name="Completed Deliveries" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerReportsPage;
