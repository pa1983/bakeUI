import React from 'react';
import {createBrowserRouter} from "react-router-dom";

import Home from '../components/Home';
import Contact from '../components/Contact';
import NotFound from '../components/NotFound';
import IngredientForm from "../components/IngredientForm.tsx";
import Layout from "../components/layout.tsx";
import IngredientsList from "../components/ingredients.tsx";
import InvoiceList from "../components/invoiceList.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,   // labout will be the root element within which other child elements are rendered
        children: [
            {
                index: true,  // the default component for the '/' route
                element: <Home/>,
                errorElement: <NotFound/>
            },
            {
                path: '/contact',
                element: <Contact/>,
                errorElement: <NotFound/>
            },
            {
                path: '/about',
                element: <Home/>,
                errorElement: <NotFound/>
            },
            {
                path: '/ingredient/ingredients',
                element: <IngredientsList/>,
            },
            {
                path: '/ingredient/new',
                element: <IngredientForm/>,
            },
            {
                path: '/ingredient/:ingredient_id',
                element: <IngredientForm/>,
            },

            {
                path: '/ingredient/ingredients',
                element: <IngredientsList/>
            },

            {
                path: '/invoice/invoices',
                element: <InvoiceList/>
            }
        ]
    },


    // not found element last - only triggers if all others fail to match
    {
        path: '*',
        element: <NotFound/>,
    },

])

export default router;