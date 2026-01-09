import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Simple Chef Cooking Animation */}
                <div className="cooking-scene">
                    {/* Chef */}
                    <div className="chef-character">
                        <div className="chef-hat"></div>
                        <div className="chef-face">
                            <div className="eye left-eye"></div>
                            <div className="eye right-eye"></div>
                            <div className="smile"></div>
                        </div>
                        <div className="chef-body"></div>
                    </div>

                    {/* Pan with food - next to chef */}
                    <div className="cooking-area">
                        <div className="pan-wrapper">
                            <div className="frying-pan">
                                <div className="pan-handle"></div>
                                <div className="food-piece food-1"></div>
                                <div className="food-piece food-2"></div>
                            </div>
                            {/* Steam above pan */}
                            <div className="steam-container">
                                <div className="steam s1"></div>
                                <div className="steam s2"></div>
                                <div className="steam s3"></div>
                            </div>
                        </div>
                        {/* Flames below pan */}
                        <div className="flames">
                            <div className="fire f1"></div>
                            <div className="fire f2"></div>
                            <div className="fire f3"></div>
                        </div>
                    </div>
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
