import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Animated Chef/Cooking Icon */}
                <div className="chef-animation">
                    <div className="pan">
                        <div className="pan-handle"></div>
                        <div className="pan-body">
                            <div className="food-item food-1"></div>
                            <div className="food-item food-2"></div>
                            <div className="food-item food-3"></div>
                        </div>
                        <div className="steam steam-1"></div>
                        <div className="steam steam-2"></div>
                        <div className="steam steam-3"></div>
                    </div>
                    <div className="flame flame-1"></div>
                    <div className="flame flame-2"></div>
                    <div className="flame flame-3"></div>
                </div>

                <h2 className="loading-text">Cooking up something delicious...</h2>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
