import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main>
                {/* The Outlet renders the matched child route element */}
                <Outlet />
            </main>
           {/*// todo - add a footer here */}
        </div>
    );
};

export default Layout;