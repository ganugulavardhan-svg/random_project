import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearStatus } from '../store/authSlice';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Notification = () => {
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearStatus());
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  if (!error && !successMessage) return null;

  const isSuccess = !!successMessage;
  const message = successMessage || error;

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,102,0.05)] max-w-[380px] animate-slide-in border-l-4 ${
        isSuccess ? 'border-l-cyber-green' : 'border-l-red-500'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="text-cyber-green shrink-0 mt-0.5" size={20} />
      ) : (
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
      )}
      <div className="flex-grow text-left pr-2">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-cyber">
          {isSuccess ? 'SYS_SUCCESS' : 'SYS_ERROR'}
        </h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => dispatch(clearStatus())}
        className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900/50 rounded-lg transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;
