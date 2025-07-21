import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import {FlashMessage} from "./FlashMessage.tsx";

const Layout = () => {
    //
    return (
        <div>
            {/* Layout.tsx */}
            <Navbar />
            xxx?
            <FlashMessage />
            <main>
                {/* The Outlet renders the matched child route element */}
                <Outlet />
            </main>
           {/*// todo - add a footer here */}
        {/*    End Layout.tsx  */}
        </div>
    );
};

export default Layout;