import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

// Navbar Component styled with Bulma
const Navbar = () => {
    const auth = useAuth();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const navRef = useRef<HTMLElement>(null);

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
                setOpenDropdown(null);
                setIsMobileMenuOpen(false);
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
                    <Link key={link.to} to={link.to} className="navbar-item" onClick={() => setOpenDropdown(null)}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <nav ref={navRef} className="navbar is-link has-shadow" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    {/* Logo/Brand Name */}
                    <Link to="/" className="navbar-item has-text-weight-bold is-size-4">
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
                        <Link to="/" className="navbar-item">Home</Link>

                        <NavDropdown
                            name="general"
                            title="General"
                            links={[
                                { to: '/buyable/brand/all', label: 'Brands' },
                                { to: '/buyable/all', label: 'Buyables' },
                                { to: '/buyable/supplier/all', label: 'Suppliers' },
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
                            name="invoices"
                            title="Invoices"
                            links={[
                                { to: '/invoice/invoices', label: 'All Invoice List' },
                                { to: '#', label: 'Add New Invoice' },
                            ]}
                        />

                        <Link to="/about" className="navbar-item">About</Link>
                        <Link to="/contact" className="navbar-item">Contact</Link>
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
                                        <button onClick={() => auth.removeUser()} className="button is-danger">
                                            <span className="icon">
                                                <i className="fas fa-sign-out-alt"></i>
                                            </span>
                                            <span>Sign out</span>
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => auth.signinRedirect()} className="button is-success">
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