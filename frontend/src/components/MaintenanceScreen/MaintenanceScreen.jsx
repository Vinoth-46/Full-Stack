import React from 'react';
import './MaintenanceScreen.css';

const MaintenanceScreen = () => {
    return (
        <div className="maintenance-screen">
            <div className="maintenance-content">
                {/* Animated Chef Working */}
                <div className="maintenance-animation">
                    <div className="chef-working">
                        <div className="chef-hat-m"></div>
                        <div className="chef-head"></div>
                        <div className="chef-body-m">
                            <div className="chef-arm-left"></div>
                            <div className="chef-arm-right"></div>
                        </div>
                    </div>
                    <div className="work-bench">
                        <div className="tools">
                            <div className="wrench"></div>
                            <div className="hammer"></div>
                        </div>
                    </div>
                    <div className="gears">
                        <div className="gear gear-1"></div>
                        <div className="gear gear-2"></div>
                    </div>
                </div>

                <h1 className="maintenance-title">🍳 Kitchen Under Renovation!</h1>
                <p className="maintenance-text">
                    We're cooking up something amazing. Our chefs are working hard to improve your experience.
                </p>
                <p className="maintenance-subtext">
                    Please check back soon. We'll be serving delicious food again shortly!
                </p>

                <div className="maintenance-timer">
                    <span className="timer-icon">⏰</span>
                    <span>Estimated time: Coming back soon!</span>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceScreen;
