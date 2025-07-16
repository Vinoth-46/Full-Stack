import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/Storecontext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId || !success) {
          navigate("/"); // fallback
          return;
        }

        const response = await axios.post(`${url}/api/order/verify`, { success, orderId });

        if (response.data.success) {
          navigate("/myorders"); // ✅ redirect here
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Error verifying payment:", error);
        navigate("/");
      }
    };

    verifyPayment();
  }, [success, orderId, url, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
