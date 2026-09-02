import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import {
  Users,
  Search,
  UserCheck,
  Trash2,
  X,
  Edit,
  Save,
  ShieldCheck
} from 'lucide-react';

export const AdminUsers = () => {
  const { users, updateUserAccount, deleteUserAccount, showNotification } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal Form State
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('Active');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  const filteredUsers = (users || []).filter(u => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search) ||
      (u.transportId || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenManageModal = (user) => {
    setSelectedUser(user);
    setEditRole(user.role || 'SELLER');
    setEditStatus(user.status || 'Active');
    setEditPhone(user.phone || '');
    setEditCity(user.city || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    const userId = selectedUser.id || selectedUser.email;
    const res = await updateUserAccount(userId, {
      role: editRole,
      status: editStatus,
      phone: editPhone,
      city: editCity
    });
    setIsSaving(false);
    if (res?.success) {
      handleCloseModal();
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const usr = targetUser || selectedUser;
    if (!usr) return;

    if (usr.email === 'ayisha@gmail.com' || usr.email === 'ayishaparveena36@gmail.com') {
      showNotification("Super Admin AYISHA account is protected and cannot be deleted!", 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete user account '${usr.name}' (${usr.email || usr.id}) from MongoDB Atlas database?`)) {
      setIsSaving(true);
      const userId = usr.id || usr.email;
      await deleteUserAccount(userId);
      setIsSaving(false);
      handleCloseModal();
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Fixed Sticky Left Sidebar */}
      <Sidebar role="ADMIN" />

      {/* Main Right Scrollable Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Users Directory (Admin Authority Only)" />

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>ECO MART Platform Users Directory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Manage registered Admins, Sellers, Buyers, and Transportation fleet accounts live in MongoDB Atlas.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-bold">
              <UserCheck className="w-4 h-4" />
              <span>Total DB Users: {users.length}</span>
            </div>
          </div>

          {/* Controls */}
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
                <option value="TRANSPORT_MANAGER">Transport Managers</option>
                <option value="TRANSPORT_DRIVER">Fleet Drivers</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email / ID</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const isSuperAdmin = user.email === 'ayisha@gmail.com';

                    return (
                      <tr key={user.id || user.email || Math.random()} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{user.name}</p>
                          {isSuperAdmin && (
                            <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">SUPER ADMIN</span>
                          )}
                        </td>
                        <td className="p-4 font-mono font-medium text-slate-700">
                          {user.email || user.transportId || user.driverId}
                        </td>
                        <td className="p-4 font-medium">{user.phone || 'N/A'}</td>
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
                          {user.city ? `${user.city}${user.state ? `, ${user.state}` : ''}` : 'India Zone'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            (user.status || 'Active') === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            user.status === 'Suspended' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenManageModal(user)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1 active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5 text-lime-400" />
                            <span>Manage</span>
                          </button>

                          {!isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1 active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive User Management Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email || selectedUser.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveChanges} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assign User Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SELLER">SELLER</option>
                    <option value="BUYER">BUYER</option>
                    <option value="TRANSPORT_MANAGER">TRANSPORT_MANAGER</option>
                    <option value="TRANSPORT_DRIVER">TRANSPORT_DRIVER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">City Location</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {selectedUser.email !== 'ayisha@gmail.com' ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(selectedUser)}
                    disabled={isSaving}
                    className="px-3.5 py-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected Super Admin</span>
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
