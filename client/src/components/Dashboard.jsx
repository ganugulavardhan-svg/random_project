import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { LogOut, User, Mail, ShieldAlert, ArrowLeft, Award } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    onNavigate('home');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-ambient-radial-green px-6 py-12 relative overflow-hidden font-mono select-none">
      <div className="absolute inset-0 crt-scanline pointer-events-none z-30 opacity-30"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyber-green/5 rounded-full blur-[120px] top-[10%] left-[15%] pointer-events-none"></div>
      <div className="absolute w-[350px] h-[350px] bg-cyber-yellow/4 rounded-full blur-[100px] bottom-[10%] right-[15%] pointer-events-none"></div>

      <div className="w-full max-w-[500px] bg-zinc-950/80 border border-cyber-green/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,255,102,0.05)] transition-all duration-300 hover:border-cyber-green/40 hover:shadow-[0_0_50px_rgba(0,255,102,0.1)] z-10 relative">
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-cyber-green transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> HOME
        </button>

        <div className="text-center mt-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-green/10 to-cyber-yellow/10 border-2 border-cyber-green/40 flex items-center justify-center text-3xl font-bold text-cyber-green mx-auto mb-4 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-cyber">
            {getInitials(user.username)}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-widest font-cyber uppercase">
            {user.displayName || user.username}
          </h2>
          <p className="text-xs text-zinc-500">OPERATIONAL ACCESS CONTROL PANEL</p>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 my-6 space-y-4 text-left">
          <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
              <User size={14} className="text-cyber-green" /> COGNOMEN
            </span>
            <span className="text-sm font-semibold text-white">{user.username}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
              <Mail size={14} className="text-cyber-green" /> SYNAPSE_LINK
            </span>
            <span className="text-sm font-semibold text-white">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
              <Award size={14} className="text-cyber-green" /> CREDITS
            </span>
            <span className="text-sm font-semibold text-cyber-primary">{user.credits ?? 0}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
              <ShieldAlert size={14} className="text-cyber-green" /> COMPILER_STATE
            </span>
            <span className={`text-xs font-semibold border px-2 py-0.5 rounded uppercase tracking-wider ${user.isVerified ? 'text-cyber-green border-cyber-green/30 bg-cyber-green/5' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5'}`}>
              {user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 px-4 bg-transparent border border-red-950 hover:border-red-500 hover:bg-red-500/10 text-red-400 font-bold rounded-xl text-xs transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          DISCONNECT CELL
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
