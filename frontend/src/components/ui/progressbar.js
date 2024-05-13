import React from 'react';

const ProgressBar = ({ progress, height = '20px', color = '#4CAF50' }) => {
    return (
        <div style={{
            width: '100%',
            backgroundColor: '#e0e0de',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <div style={{
                height,
                width: `${progress}%`,
                backgroundColor: color,
                transition: 'width 0.3s ease-in-out',
            }} />
        </div>
    );
};

export default ProgressBar;
