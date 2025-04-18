import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

const UserLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-64 flex-shrink-0">
                <UserSidebar />
            </div>
            <div className="flex-1 overflow-y-auto bg-green-50">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserLayout; 