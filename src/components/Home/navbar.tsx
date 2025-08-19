import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {VerifiedUser, ExpandCircleDown} from '@mui/icons-material';

import {Login, Logout, Info, Person} from '@mui/icons-material';
import FriendlyDate from "../Utility/FriendlyDate.tsx";


// Navbar Component
const Navbar = () => {
    const auth = useAuth();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handler to toggle a specific dropdown by its name
    // This also handles closing the currently open dropdown
    const handleDropdownToggle = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    // Function to toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (

        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg rounded-b-lg">
            {/*Start Navbar.tsx*/}
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                {/* Logo/Brand Name */}
                <div
                    className="text-white text-2xl font-bold rounded-md py-1 px-2 hover:bg-blue-700 transition duration-300">
                    Bake
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-2"
                        aria-label="Toggle mobile menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation links - hidden on mobile by default, shown when mobile menu is open */}
                <div
                    className={`${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    } w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-start md:items-center">
                        {/* Home link */}
                        <li>
                            <a
                                href="/"
                                className="text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700"
                            >
                                Home
                            </a>
                        </li>


                        {/*General dropdown menu
                        */}
                        <li className="relative">

                            <button
                                onClick={() => handleDropdownToggle('general')}
                                className="flex items-center text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'general'}
                            >

                                General
                                <ExpandCircleDown
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                        openDropdown === 'general' ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {openDropdown === 'general' && (
                                <ul className="absolute md:top-full left-0 md:left-auto mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 transition-all duration-300 ease-in-out transform origin-top md:origin-top-right scale-y-100 opacity-100">
                                    <li>
                                        <Link to="/buyable/brand/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Brands</Link>
                                    </li>


                                    <li>
                                        <Link to="/buyable/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Buyables
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/buyable/supplier/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Suppliers
                                        </Link>
                                    </li>

                                </ul>
                            )}
                        </li>


                        {/* Ingredients Dropdown */}
                        <li className="relative">

                            <button
                                onClick={() => handleDropdownToggle('ingredients')}
                                className="flex items-center text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'ingredients'}
                            >

                                Ingredients
                                <ExpandCircleDown
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                        openDropdown === 'ingredients' ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {openDropdown === 'ingredients' && (
                                <ul className="absolute md:top-full left-0 md:left-auto mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 transition-all duration-300 ease-in-out transform origin-top md:origin-top-right scale-y-100 opacity-100">
                                    <li>
                                        <Link to="/ingredient/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">All
                                            Ingredients</Link>
                                    </li>


                                    <li>
                                        <Link to="/ingredient/new"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Add
                                            New</Link>
                                    </li>

                                </ul>
                            )}
                        </li>

                        {/* labourers Dropdown */}
                        <li className="relative">

                            <button
                                onClick={() => handleDropdownToggle('labourers')}
                                className="flex items-center text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'labourers'}
                            >

                                Labourers
                                <ExpandCircleDown
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                        openDropdown === 'labourers' ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {openDropdown === 'labourers' && (
                                <ul className="absolute md:top-full left-0 md:left-auto mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 transition-all duration-300 ease-in-out transform origin-top md:origin-top-right scale-y-100 opacity-100">
                                    <li>
                                        <Link to="/labourer/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">All
                                            labourers</Link>
                                    </li>


                                    <li>
                                        <Link to="/labourer/new"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Add
                                            New</Link>
                                    </li>

                                </ul>
                            )}
                        </li>


                        {/* Recipes Dropdown */}
                        <li className="relative">

                            <button
                                onClick={() => handleDropdownToggle('recipes')}
                                className="flex items-center text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'recipes'}
                            >

                                Recipes
                                <ExpandCircleDown
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                        openDropdown === 'recipes' ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {openDropdown === 'recipes' && (
                                <ul className="absolute md:top-full left-0 md:left-auto mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 transition-all duration-300 ease-in-out transform origin-top md:origin-top-right scale-y-100 opacity-100">
                                    <li>
                                        <Link to="/recipe/all"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">All
                                            Recipes</Link>
                                    </li>


                                    <li>
                                        <Link to="/recipe/new"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Add
                                            New</Link>
                                    </li>

                                </ul>
                            )}
                        </li>


                        {/* Invoices Dropdown */}
                        <li className="relative">
                            <button
                                onClick={() => handleDropdownToggle('invoices')}
                                className="flex items-center text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'invoices'}
                            >
                                Invoices
                                <ExpandCircleDown
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                        openDropdown === 'invoices' ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {openDropdown === 'invoices' && (
                                <ul className="absolute md:top-full left-0 md:left-auto mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 transition-all duration-300 ease-in-out transform origin-top md:origin-top-right scale-y-100 opacity-100">
                                    <li>
                                        <Link to="/invoice/invoices"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">All
                                            Invoice List</Link>
                                    </li>


                                    <li>
                                        <Link to="#"
                                              className="block px-4 py-2 hover:bg-gray-100 rounded-md transition duration-200">Add
                                            New Invoice</Link>
                                    </li>

                                </ul>
                            )}
                        </li>


                        {/* About link */}
                        <li>

                            <Link to="/about"
                                  className="text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700">About</Link>

                        </li>

                        {/* Contact link */}
                        <li>
                            <Link to="/contact"
                                  className="text-white hover:text-blue-200 transition duration-300 py-2 px-3 rounded-md hover:bg-blue-700">Contact</Link>
                        </li>

                    </ul>
                </div>

                {/* User Logo and Sign-in Button */}
                <div
                    className={`${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    } w-full md:flex md:items-center md:w-auto mt-4 md:mt-0 md:ml-auto`}
                >
                    {/* Navigation and Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {auth.isAuthenticated ? (
                            <> {/* Added fragment here to properly wrap multiple elements */}
                                {/* User Info (e.g., email) */}
                                <span className="flex items-center text-sm font-medium">
                                    <Person className="w-4 h-4 mr-1 text-blue-200"/>
                                    {/*todo - add an onclick to open user's profile page*/}
                                    {auth.user?.profile.email}

                                </span>
                                {/* Sign Out Button */}
                                <button
                                    onClick={() => auth.removeUser()}
                                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                                >
                                    <Logout className="w-4 h-4 mr-2"/>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Sign In Button */}
                                <button
                                    onClick={() => auth.signinRedirect()}
                                    className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                                >
                                    <Login className="w-4 h-4 mr-2"/>
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/*    End Navbar.tst */}
        </nav>
    );
};
export default Navbar;