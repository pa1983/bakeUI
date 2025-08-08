import React from 'react';
import {createBrowserRouter} from "react-router-dom";

import Home from '../components/Home/Home.tsx';
import Contact from '../components/Home/Contact.tsx';
import NotFound from '../components/Home/NotFound.tsx';
import IngredientForm from "../components/IngredientForm.tsx";
import Layout from "../components/layout.tsx";
import IngredientsList from "../components/ingredientsList.tsx";
import InvoiceList from "../components/Invoice/invoiceList.tsx";
import InvoiceViewer from "../components/Invoice/InvoiceViewer.tsx";
import Dashboard from '../components/dashboard';
import BrandList from "../components/Brand/BrandList.tsx";
import SupplierList from "../components/Supplier/SupplierList.tsx";
import ViewBrandForm from "../components/Brand/ViewBrandForm.tsx";  // todo - needs to be specifically a brand form - create factory function called ViewBrandForm to encapsulate the factory element
import BuyableList from "../components/Buyable/BuyableList.tsx";
import ViewBuyableForm from "../components/Buyable/ViewBuyableForm.tsx";
import ViewSupplierForm from "../components/Supplier/ViewSupplierForm.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,   // labout will be the root element within which other child elements are rendered
        children: [
            {
                index: true,  // the default component for the '/' route
                element: <Dashboard/>,
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
            },
            {
                path: '/invoice/:invoice_id',
                element: <InvoiceViewer/>
            },


            {
                path: '/buyable/all',
                element: <BuyableList/>
            },

            {
                path: '/buyable/:id',
                element: <ViewBuyableForm/>
            },


            {
                path: '/buyable/brand/all',
                element: <BrandList/>
            },
            {
                path: '/buyable/brand/:id',
                element: <ViewBrandForm/>
            },

            {
                path: '/buyable/all',
                element: <ViewBrandForm/>
            },
            {
                path: '/buyable/:id',
                element: <ViewBuyableForm/>
            },

            {
                path: '/buyable/supplier/all',
                element: <SupplierList/>
            },
            {
                path: 'buyable/supplier/:id',
                element: <ViewSupplierForm/>
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