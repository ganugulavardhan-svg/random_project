import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { clearStatus, fetchCurrentUser, setOAuthError } from './store/authSlice';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import Notification from './components/Notification';

const AuthApp = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'success') {
      dispatch(fetchCurrentUser());
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('oauth') === 'error') {
      dispatch(setOAuthError(params.get('message') || 'OAuth authentication failed.'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [dispatch]);

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
    dispatch(clearStatus());
    setCurrentPage(page);
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white">
      <Notification />

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
