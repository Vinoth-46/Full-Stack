import React, { useContext, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import MaintenanceScreen from './components/MaintenanceScreen/MaintenanceScreen';
import NotFound from './pages/NotFound/NotFound';
import { StoreContext } from './context/Storecontext';

// Maintenance mode - set VITE_MAINTENANCE_MODE=true in Render env vars to enable
const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

const App = () => {
  const { showLogin, setShowLogin, food_list } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen once food list is loaded
    if (food_list.length > 0) {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [food_list]);

  // Show maintenance screen if enabled
  if (MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      {loading && <LoadingScreen />}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;


