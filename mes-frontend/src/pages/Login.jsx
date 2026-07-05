import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, Loader2, Factory } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Login failed.';
      setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans p-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Factory className="text-white w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">MES Portal</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Sign in to manage manufacturing orders.</p>

        {error && <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 text-red-400 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute inset-y-3 left-3 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="absolute inset-y-3 left-3 h-5 w-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex justify-center items-center"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
