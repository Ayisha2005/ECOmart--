import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { DollarSign, IndianRupee, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export const SellerEarningsPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const myOrders = orders.filter(o => o.sellerId === currentUser?.id || o.sellerName === currentUser?.name);
  const totalEarnings = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingEarnings = myOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Seller Sales & Earnings Ledger" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-400" />
                <span>Financial Settlement & Payout Overview</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Verified direct settlements in INR ₹ via bank transfer and Indian UPI</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Gross Completed Earnings</p>
              <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Directly Deposited to Bank</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase">Pending Escrow Payouts</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">₹{pendingEarnings.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Awaiting Buyer Confirmation</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Recent Transaction History (INR ₹)</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {myOrders.map(ord => (
                <div key={ord.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{ord.productTitle}</p>
                    <p className="text-xs text-slate-500">{ord.id} • {ord.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-700">+₹{ord.totalPrice.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerEarningsPage;
