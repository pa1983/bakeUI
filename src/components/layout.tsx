import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Home/navbar.tsx';
import {FlashMessage} from "./Utility/FlashMessage.tsx";

const Layout = () => {

    return (
        <div>
            <Navbar />
            <FlashMessage />
            <main>
                {/* The Outlet renders the matched child route element */}
                <Outlet />
            </main>
           {/*// todo - add a general page footer here */}
        </div>
    );
};

export default Layout;