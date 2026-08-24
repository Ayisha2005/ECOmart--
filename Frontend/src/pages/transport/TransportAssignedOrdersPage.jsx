import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Truck, Package, Clock, Navigation } from 'lucide-react';

export const TransportAssignedOrdersPage = ({ title = "Assigned Logistics Orders" }) => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useData();

  const myOrders = orders.filter(o => 
    o.transportId === currentUser?.transportId || o.transportId === 'TRANS001' || !o.transportId
  );

  const handleNextStatus = (order) => {
    const statusFlow = ['Transportation Assigned', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Delivered', 'Completed'];
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx !== -1 && currentIdx < statusFlow.length - 1) {
      updateOrderStatus(order.id, statusFlow[currentIdx + 1]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="TRANSPORTATION" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-cyan-500/30 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>{title} Management</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Driver Transport ID: {currentUser?.transportId || 'TRANS001'} | Vehicle: {currentUser?.vehicleNumber || 'TN 09 CB 4512'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {myOrders.map(order => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cyan-700">{order.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full uppercase">
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{order.productTitle}</h4>
                    <p className="text-xs text-slate-500">Pickup: <span className="font-bold text-slate-700">{order.sellerName}</span> ({order.sellerAddress})</p>
                    <p className="text-xs text-slate-500">Delivery: <span className="font-bold text-slate-700">{order.buyerName}</span> ({order.buyerAddress})</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNextStatus(order)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Advance Status</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransportAssignedOrdersPage;
