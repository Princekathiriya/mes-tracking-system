import React from 'react';

export const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-slate-800 text-slate-300 border-slate-700',
    Cutting: 'bg-blue-900/50 text-blue-300 border-blue-800',
    Welding: 'bg-orange-900/50 text-orange-300 border-orange-800',
    QC: 'bg-purple-900/50 text-purple-300 border-purple-800',
    Completed: 'bg-green-900/50 text-green-300 border-green-800'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
};
