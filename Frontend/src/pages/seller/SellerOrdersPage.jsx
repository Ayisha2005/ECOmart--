import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { ShoppingCart, CheckCircle2, Clock, Truck } from 'lucide-react';

export const SellerOrdersPage = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useData();

  const myOrders = orders.filter(o => o.sellerId === currentUser?.id || o.sellerName === currentUser?.name);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Orders & Pickup Requests" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Order Pickup Fulfillment ({myOrders.length})</h2>
              <p className="text-xs text-slate-500">Confirm buyer purchase orders to dispatch assigned EV transport drivers</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {myOrders.length > 0 ? (
                myOrders.map((ord) => (
                  <div key={ord.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-slate-900">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{ord.productTitle}</h4>
                      <p className="text-xs text-slate-500">Buyer: <span className="font-bold text-slate-700">{ord.buyerName}</span> ({ord.buyerAddress})</p>
                      <p className="text-xs text-slate-500">Transport: <span className="font-mono font-bold text-slate-700">{ord.transportName || 'Pending Assignment'}</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-emerald-700">₹{ord.totalPrice.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{ord.quantityKg} kg Tonnage</p>
                      </div>

                      {ord.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, 'Confirmed')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Accept Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                  No orders received yet.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
