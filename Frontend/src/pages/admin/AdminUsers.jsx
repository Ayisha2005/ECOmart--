import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Users, Search, Filter, ShieldCheck, UserCheck, MoreVertical } from 'lucide-react';

export const AdminUsers = () => {
  const { users } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email?.toLowerCase().includes(search.toLowerCase()) ||
                          u.phone?.includes(search) ||
                          u.transportId?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-x-hidden">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Users Directory (Admin Only)" />

        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Users className="w-5 h-5 text-lime-400" />
                <span>ECO MART User Accounts Directory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage registered Admins, Sellers, Buyers, and Admin-created Transportation fleet accounts across India.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name, email, phone number, or Transport ID..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 uppercase"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="ADMIN">Admins</option>
                <option value="SELLER">Sellers</option>
                <option value="BUYER">Buyers</option>
                <option value="TRANSPORTATION">Transportation</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email / ID</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        {user.createdBy === 'ADMIN' && (
                          <span className="text-[9px] font-bold text-cyan-600">Admin Issued Account</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-700">
                        {user.email || user.transportId}
                      </td>
                      <td className="p-4 font-medium">{user.phone}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          user.role === 'ADMIN' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          user.role === 'SELLER' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          user.role === 'BUYER' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-cyan-100 text-cyan-800 border border-cyan-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {user.city ? `${user.city}, ${user.state}` : 'India Zone'}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button type="button" className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all cursor-pointer">
                          Manage User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
