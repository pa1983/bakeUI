import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import styles from '../../styles/Navbar.module.css';
import {ThemeToggle} from "../ThemeToggle.tsx";

// Navbar Component styled with Bulma
const Navbar = () => {
    const auth = useAuth();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const navRef = useRef<HTMLElement>(null);

    // Close all menus
    const closeMenus = () => {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
    };

    // Handler to toggle a specific dropdown
    const handleDropdownToggle = (dropdownName: string) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    // Function to toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close dropdowns and mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                closeMenus();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Helper component for dropdowns to reduce repetition
    const NavDropdown = ({ name, title, links }: { name: string; title: string; links: { to: string; label: string }[] }) => (
        <div className={`navbar-item has-dropdown ${openDropdown === name ? 'is-active' : ''}`}>
            <a className="navbar-link" onClick={() => handleDropdownToggle(name)}>
                {title}
            </a>
            <div className="navbar-dropdown">
                {links.map(link => (
                    <Link key={link.to} to={link.to} className="navbar-item" onClick={closeMenus}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <nav ref={navRef} className={`navbar ${styles.stickyNav}`} role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    {/* Logo/Brand Name */}
                    <Link to="/" className="navbar-item has-text-weight-bold is-size-4" onClick={closeMenus}>
                        Bake
                    </Link>

                    {/* Mobile menu (hamburger) button */}
                    <a
                        role="button"
                        className={`navbar-burger ${isMobileMenuOpen ? 'is-active' : ''}`}
                        aria-label="menu"
                        aria-expanded={isMobileMenuOpen}
                        onClick={toggleMobileMenu}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                {/* Navigation Links */}
                <div className={`navbar-menu ${isMobileMenuOpen ? 'is-active' : ''}`}>
                    <div className="navbar-start">

                        <NavDropdown
                            name="general"
                            title="General"
                            links={[
                                { to: '/buyable/brand/all', label: 'Brands' },
                                { to: '/buyable/supplier/all', label: 'Suppliers' },
                            ]}
                        />
                        <NavDropdown
                            name="invoices"
                            title="Invoices"
                            links={[
                                { to: '/invoice/invoices', label: 'All Invoices' },
                                { to: '/invoice/new', label: 'New Invoice' },
                            ]}
                        />

                        <NavDropdown
                            name="buyables"
                            title="Buyables"
                            links={[

                                { to: '/buyable/all', label: 'Buyables' },
                                { to: '/buyable/new', label: 'New Buyable' },
                            ]}
                        />


                        <NavDropdown
                            name="ingredients"
                            title="Ingredients"
                            links={[
                                { to: '/ingredient/all', label: 'All Ingredients' },
                                { to: '/ingredient/new', label: 'Add New' },
                            ]}
                        />

                        <NavDropdown
                            name="labourers"
                            title="Labourers"
                            links={[
                                { to: '/labourer/all', label: 'All Labourers' },
                                { to: '/labourer/new', label: 'Add New' },
                            ]}
                        />

                        <NavDropdown
                            name="recipes"
                            title="Recipes"
                            links={[
                                { to: '/recipe/all', label: 'All Recipes' },
                                { to: '/recipe/new', label: 'Add New' },
                            ]}
                        />
                        <NavDropdown
                            name="info"
                            title="Info"
                            links={[
                                { to: '/about', label: 'About' },
                                { to: '/contact', label: 'Contact' },
                            ]}
                        />
                        <ThemeToggle/>

                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {auth.isAuthenticated ? (
                                    <>
                                        <div className="navbar-item">
                                            <span className="icon-text">
                                                <span className="icon">
                                                    <i className="fas fa-user"></i>
                                                </span>
                                                <span>{auth.user?.profile.email}</span>
                                            </span>
                                        </div>
                                        <button onClick={() => {
                                            closeMenus();
                                            auth.signoutRedirect();
                                        }} className="button is-danger">
                                            <span className="icon">
                                                <i className="fas fa-sign-out-alt"></i>
                                            </span>
                                            <span>Sign out</span>
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => {
                                        closeMenus();
                                        auth.signinRedirect();
                                    }} className="button is-success">
                                        <span className="icon">
                                            <i className="fas fa-sign-in-alt"></i>
                                        </span>
                                        <span>Sign in</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;