import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import { Factory, BarChart3, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Cell } from 'recharts';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.currentStatus === 'Completed').length,
    inProgress: orders.filter(o => ['Cutting', 'Welding', 'QC'].includes(o.currentStatus)).length,
    pending: orders.filter(o => o.currentStatus === 'Pending').length,
  };

  const chartData = [
    { name: 'Pending', count: stats.pending, color: '#94a3b8' },
    { name: 'Cutting', count: orders.filter(o => o.currentStatus === 'Cutting').length, color: '#3b82f6' },
    { name: 'Welding', count: orders.filter(o => o.currentStatus === 'Welding').length, color: '#f97316' },
    { name: 'QC', count: orders.filter(o => o.currentStatus === 'QC').length, color: '#a855f7' },
    { name: 'Completed', count: stats.completed, color: '#22c55e' }
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createSampleOrder = async () => {
    try {
      await api.post('/orders', {
        orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
        productName: 'Tesla Model Y Chassis',
        quantity: 50
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/orders/${selectedOrder._id}/status`, {
        newStatus: e.target.status.value,
        notes: e.target.notes.value
      });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col text-slate-300">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Factory className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">MES Platform</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right text-sm">
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-slate-500 text-xs">Role: {user.role}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Production Overview</h2>
            <p className="text-slate-500 mt-1 text-sm">Real-time status of all active manufacturing orders.</p>
          </div>
          <div className="space-x-3">
            <button onClick={createSampleOrder} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-white hover:bg-slate-700 transition-colors shadow-sm">
              + Create Sample Order
            </button>
            <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-colors">
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-950 text-blue-400 rounded-lg"><BarChart3 size={20} /></div>
                <h3 className="text-sm font-medium text-slate-400">Total Orders</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-950 text-green-400 rounded-lg"><CheckCircle2 size={20} /></div>
                <h3 className="text-sm font-medium text-slate-400">Completed</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.completed}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-orange-950 text-orange-400 rounded-lg"><Clock size={20} /></div>
                <h3 className="text-sm font-medium text-slate-400">In Progress</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-slate-800 text-slate-400 rounded-lg"><AlertCircle size={20} /></div>
                <h3 className="text-sm font-medium text-slate-400">Pending</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Orders by Production Stage</h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#0f172a' }}
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-4">Detailed Order Log</h3>
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Number</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No active orders found. Click "+ Create Sample Order" to test.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-medium text-white">{order.orderNumber}</td>
                      <td className="p-4 text-slate-300">{order.productName}</td>
                      <td className="p-4 text-slate-300">{order.quantity} units</td>
                      <td className="p-4"><StatusBadge status={order.currentStatus} /></td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          Update & View Audit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold text-white">Order {selectedOrder.orderNumber}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedOrder.productName} • {selectedOrder.quantity} units</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-500 hover:text-slate-300 text-2xl transition-colors">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Advance Production</h4>
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">New Status</label>
                    <select name="status" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      {['Pending', 'Cutting', 'Welding', 'QC', 'Completed'].map(s => (
                        <option key={s} value={s} disabled={s === selectedOrder.currentStatus}>{s} {s === selectedOrder.currentStatus ? '(Current)' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Audit Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows="3"
                      placeholder="e.g., QC passed, moving to packaging..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-600 text-sm resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20">
                    Save Update to Audit Log
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Digital Thread (Audit)</h4>
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-800 ml-1">
                  {selectedOrder.statusHistory.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-6 h-6 bg-slate-950 border-2 border-blue-500 rounded-full z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <StatusBadge status={entry.status} />
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {entry.notes && <p className="text-sm text-slate-300 mt-2">"{entry.notes}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
