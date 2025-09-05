import { Outlet } from 'react-router-dom';
import Navbar from './Home/Navbar.tsx';
import {FlashMessage} from "./Utility/FlashMessage.tsx";
import styles from '../styles/layout.module.css';

const Layout = () => {

    return (
        <div>
            <FlashMessage />
            <Navbar />

            <main className={styles.mainContent}>
                <Outlet />
            </main>
           {/*// todo - add a general page footer here */}
        </div>
    );
};

export default Layout;