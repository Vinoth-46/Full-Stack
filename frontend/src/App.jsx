import React, { useContext, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
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

// Environment variable maintenance mode (quick toggle via Render)
const ENV_MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

const App = () => {
  const { showLogin, setShowLogin, food_list, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [telegramMaintenance, setTelegramMaintenance] = useState(false);

  // Check maintenance status from Telegram bot API
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await axios.get(url + '/api/settings/maintenance');
        if (response.data.success) {
          setTelegramMaintenance(response.data.maintenance);
        }
      } catch (error) {
        console.log('Maintenance check failed, using env variable only');
      }
    };
    checkMaintenance();

    // Check every 30 seconds
    const interval = setInterval(checkMaintenance, 30000);
    return () => clearInterval(interval);
  }, [url]);

  useEffect(() => {
    // Hide loading screen once food list is loaded
    if (food_list.length > 0) {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [food_list]);

  // Show maintenance if EITHER env variable OR Telegram bot says so
  if (ENV_MAINTENANCE || telegramMaintenance) {
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



