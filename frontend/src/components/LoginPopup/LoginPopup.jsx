import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/Storecontext';

const LoginPopup = ({ setShowLogin }) => {
  const { url } = useContext(StoreContext);

  const [currState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await fetch(url + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setShowLogin(false);
      } else {
        alert(result.message);
      }

    } catch (error) {
      console.error("Error during auth:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={onSubmitHandler}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
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

        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
