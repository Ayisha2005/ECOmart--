import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, CheckCircle2 } from 'lucide-react';

import { isBuyerOrder } from '../../utils/orderUtils';

export const BuyerOrdersPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const safeOrders = Array.isArray(orders) ? orders : [];
  let myOrders = safeOrders.filter(o => isBuyerOrder(o, currentUser));
  if (myOrders.length === 0 && safeOrders.length > 0) {
    myOrders = safeOrders;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="My Purchase Orders History" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Purchase Orders & Logistics Status ({myOrders.length})</h2>
            <Link
              to="/buyer/tracking"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Live EV Tracking Map</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {myOrders.map(ord => (
                <div key={ord.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                        {ord.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{ord.productTitle}</h4>
                    <p className="text-xs text-slate-500">Seller: <span className="font-bold text-slate-700">{ord.sellerName}</span> ({ord.sellerAddress})</p>
                    <p className="text-xs text-slate-500">Transport: <span className="font-mono font-bold text-slate-700">{ord.transportName || 'TRANS001'}</span></p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-base font-extrabold text-emerald-700">₹{ord.totalPrice.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{ord.quantityKg} kg Tonnage</p>
                    </div>

                    <Link
                      to="/buyer/tracking"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Track Order
                    </Link>
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

export default BuyerOrdersPage;
