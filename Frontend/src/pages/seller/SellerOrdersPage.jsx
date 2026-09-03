import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { ShoppingCart, CheckCircle2, Clock, Truck, PlusCircle, UserCheck, X, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { isSellerOrder } from '../../utils/orderUtils';

export const SellerOrdersPage = () => {
  const { currentUser } = useAuth();
  const { orders, products, placeOrder, updateOrderStatus } = useData();

  const safeOrders = Array.isArray(orders) ? orders : [];
  let myOrders = safeOrders.filter(o => isSellerOrder(o, currentUser));
  if (myOrders.length === 0 && safeOrders.length > 0) {
    myOrders = safeOrders;
  }

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [buyerName, setBuyerName] = useState('Anand Polymers India');
  const [buyerPhone, setBuyerPhone] = useState('+91 97909 11223');
  const [buyerAddress, setBuyerAddress] = useState('Ambattur Industrial Estate, Chennai, TN');
  const [customPrice, setCustomPrice] = useState('');
  const [customWeight, setCustomWeight] = useState('');

  const handleCreateAndAssignOrder = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId) || products[0];
    if (!product) return;

    const buyerInfo = {
      id: 'user-buyer-1',
      name: buyerName || 'Anand Polymers India',
      email: 'buyer@ecomart.in',
      phone: buyerPhone || '+91 97909 11223',
      address: buyerAddress || 'Chennai, TN',
      city: 'Chennai',
      state: 'Tamil Nadu'
    };

    const weight = Number(customWeight) || product.weightKg || 500;

    placeOrder(product, buyerInfo, weight);
    setShowAssignModal(false);
    setSelectedProductId('');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Orders & Pickup Requests" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Order Pickup Fulfillment ({myOrders.length})</h2>
              <p className="text-xs text-slate-500">Confirm buyer purchase orders or assign new direct orders to buyers</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-100" />
              <span>Create & Assign Order to Buyer</span>
            </button>
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
                      <p className="text-xs text-slate-500">Buyer: <span className="font-bold text-slate-700">{ord.buyerName}</span> ({ord.buyerAddress || 'Chennai, TN'})</p>
                      <p className="text-xs text-slate-500">Transport: <span className="font-mono font-bold text-slate-700">{ord.transportCompanyName || ord.transportName || 'Pending Assignment'}</span></p>
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
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md active:scale-95 transition-transform"
                        >
                          Accept & Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                  No orders received yet. Click "Create & Assign Order to Buyer" above to issue a sales order.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal to Create & Assign Order directly to Buyer */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Create & Assign Order to Buyer</h3>
                <p className="text-xs text-slate-400">Issue an order directly to a buyer. It will reflect on their Buyer Orders page.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAndAssignOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Scrap Product Listing *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setCustomPrice(prod.price);
                      setCustomWeight(prod.weightKg);
                    }
                  }}
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  <option value="">-- Choose Listing --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.weightKg} kg) - ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Buyer Business Name *</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Anand Polymers India"
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Buyer Phone *</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quantity (Kg) *</label>
                  <input
                    type="number"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    placeholder="e.g. 500"
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Buyer Delivery Address *</label>
                <input
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Issue & Assign Order to Buyer</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
