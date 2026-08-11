import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { StoreContext } from '../../context/Storecontext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const { getTotalCartAmount, token, setToken, searchQuery, setSearchQuery, food_list } = useContext(StoreContext);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);
    if (value.trim() && window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const toggleSearch = () => {
    setShowSearchInput((prev) => !prev);
    setShowDropdown(true);
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSelectSuggestion = (dishName) => {
    setSearchQuery(dishName);
    setShowDropdown(false);
    if (window.location.pathname !== "/") {
      navigate("/");
    }
    const foodSection = document.getElementById("food-display");
    if (foodSection) {
      foodSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const suggestions = searchQuery.trim() && food_list
    ? food_list.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div className="navbar">
      <Link to="/"><img src={assets.logo} alt="logo" className="logo" /></Link>

      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}
          >
            home
          </Link>
        </li>
        <li>
          <a
            href="#explore-menu"
            onClick={() => setMenu("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            menu
          </a>
        </li>
        <li>
          <a
            href="#app-downlode"
            onClick={() => setMenu("mobile-app")}
            className={menu === "mobile-app" ? "active" : ""}
          >
            mobile-app
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => setMenu("contact us")}
            className={menu === "contact us" ? "active" : ""}
          >
            contact us
          </a>
        </li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-container">
          <img 
            src={assets.search_icon} 
            alt="search" 
            onClick={toggleSearch} 
            title="Search dishes"
          />
          {(showSearchInput || searchQuery) && (
            <div className="navbar-search-box">
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                autoFocus
              />
              {searchQuery && (
                <span 
                  className="search-clear-btn" 
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  ✕
                </span>
              )}

              {/* 🔍 Auto-complete Suggestions Dropdown */}
              {searchQuery.trim() && showDropdown && (
                <ul className="navbar-search-dropdown">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => handleSelectSuggestion(item.name)}
                        className="search-suggestion-item"
                      >
                        {item.image && (
                          <img src={item.image} alt={item.name} className="suggestion-img" />
                        )}
                        <div className="suggestion-info">
                          <span className="suggestion-name">{item.name}</span>
                          <span className="suggestion-cat">{item.category} • ${item.price}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="search-no-suggestion">No matching food found</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}> {/* ✅ Navigate to /orders */}
                <img src={assets.bag_icon} alt="orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
