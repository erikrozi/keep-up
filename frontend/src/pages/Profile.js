import React from 'react';
import { useLocation } from 'react-router-dom';

function Profile() {
    const location = useLocation();
    const data = location.state;

    console.log(data);

    return (
        <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
            <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">

                <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">User Profile</h1>
                <ul>
                    {Object.entries(data.data).map(([key, value], index) => (
                    <li key={index}>{`${key}: ${value}`}</li>
                    ))}
                </ul>
             </div>
        </div>
    );
}

export default Profile;
