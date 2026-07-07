import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { clearStatus } from './store/authSlice';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import Notification from './components/Notification';

const AuthApp = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Page routing state: 'home' | 'login' | 'signup' | 'dashboard'
  const [currentPage, setCurrentPage] = useState('home');

  // Trigger auto-redirect to home on successful authentication
  useEffect(() => {
    if (user) {
      if (currentPage === 'login' || currentPage === 'signup') {
        setCurrentPage('home');
      }
    } else {
      if (currentPage === 'dashboard') {
        setCurrentPage('home');
      }
    }
  }, [user, currentPage]);

  const handleNavigate = (page) => {
    dispatch(clearStatus()); // Clear auth errors/status messages upon switching page routing
    setCurrentPage(page);
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white">
      {/* Toast notifications */}
      <Notification />

      {/* Render dedicated full screen page views */}
      {currentPage === 'home' && (
        <Homepage onNavigate={handleNavigate} />
      )}

      {currentPage === 'login' && (
        <Login onNavigate={handleNavigate} />
      )}

      {currentPage === 'signup' && (
        <Signup onNavigate={handleNavigate} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} />
      )}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthApp />
    </Provider>
  );
}

export default App;
