import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Animated Chef with Pan */}
                <div className="chef-animation">
                    {/* Chef Body */}
                    <div className="chef">
                        <div className="chef-hat">
                            <div className="hat-top"></div>
                            <div className="hat-band"></div>
                        </div>
                        <div className="chef-face">
                            <div className="chef-eye left"></div>
                            <div className="chef-eye right"></div>
                            <div className="chef-smile"></div>
                        </div>
                        <div className="chef-body"></div>
                        {/* Chef's arm holding pan */}
                        <div className="chef-arm">
                            <div className="pan">
                                <div className="pan-handle"></div>
                                <div className="pan-body">
                                    <div className="toast toast-1"></div>
                                    <div className="toast toast-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Steam from pan */}
                    <div className="steam steam-1"></div>
                    <div className="steam steam-2"></div>
                    <div className="steam steam-3"></div>

                    {/* Flames under pan */}
                    <div className="stove">
                        <div className="flame flame-1"></div>
                        <div className="flame flame-2"></div>
                        <div className="flame flame-3"></div>
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
