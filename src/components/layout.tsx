import { Outlet } from 'react-router-dom';
import Navbar from './Home/Navbar.tsx';
import {FlashMessage} from "./Utility/FlashMessage.tsx";
import styles from '../styles/Layout.module.css';

const Layout = () => {

    return (
        <div>
            <FlashMessage />
            {/*float flash message above all other content */}
            <Navbar />

            <main className={styles.mainContent}>
                {/* The Outlet renders the matched child route element */}
                <Outlet />
            </main>
           {/*// todo - add a general page footer here */}
        </div>
    );
};

export default Layout;