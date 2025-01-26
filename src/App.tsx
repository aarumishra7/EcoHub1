import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Orders from './pages/Profile/Orders';
import Addresses from './pages/Profile/Addresses';
import Agreements from './pages/Agreements';
import Materials from './pages/Materials';
import Auth from './pages/Auth';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>}>
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
          <Route path="/agreements" element={<AuthGuard><Agreements /></AuthGuard>} />
          <Route path="/materials" element={<AuthGuard><Materials /></AuthGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;