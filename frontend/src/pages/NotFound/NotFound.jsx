import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                {/* Animated Empty Plate */}
                <div className="empty-plate-animation">
                    <div className="plate">
                        <div className="plate-inner">
                            <div className="crumb crumb-1"></div>
                            <div className="crumb crumb-2"></div>
                            <div className="crumb crumb-3"></div>
                        </div>
                        <div className="plate-shine"></div>
                    </div>
                    <div className="sad-face">
                        <div className="tear tear-left"></div>
                        <div className="tear tear-right"></div>
                    </div>
                    <div className="utensils">
                        <div className="fork-404"></div>
                        <div className="knife-404"></div>
                    </div>
                </div>

                <h1 className="error-code">
                    <span className="four">4</span>
                    <span className="zero">
                        <div className="donut"></div>
                    </span>
                    <span className="four">4</span>
                </h1>

                <h2 className="error-title">Oops! This dish doesn't exist!</h2>
                <p className="error-text">
                    Looks like this page got eaten before you arrived.
                    The menu item you're looking for is not on our kitchen counter.
                </p>

                <div className="not-found-actions">
                    <Link to="/" className="home-btn">
                        🏠 Back to Menu
                    </Link>
                    <Link to="/#explore-menu" className="explore-btn">
                        🍽️ Explore Dishes
                    </Link>
                </div>

                {/* Floating Food Elements */}
                <div className="floating-foods">
                    <span className="float-item f1">🍕</span>
                    <span className="float-item f2">🍔</span>
                    <span className="float-item f3">🍟</span>
                    <span className="float-item f4">🌮</span>
                    <span className="float-item f5">🍩</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
