import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/Storecontext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isLogin = currState === "Login";

  const resetForm = () => {
    setData({ name: "", email: "", password: "" });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(url + endpoint, data);
      const result = response.data;

      if (result.success) {
        alert(result.message);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user)); // Ensure user object excludes sensitive data
        setToken(result.token);
        setShowLogin(false);
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server error. Please try again later.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={onSubmitHandler}>
        <div className="login-popup-title">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              value={data.name}
              onChange={onChangeHandler}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            value={data.email}
            onChange={onChangeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={data.password}
            onChange={onChangeHandler}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {isLogin ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => { setCurrentState("Sign Up"); resetForm(); }}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => { setCurrentState("Login"); resetForm(); }}>
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
