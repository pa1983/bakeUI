import React from 'react';
import {createBrowserRouter} from "react-router-dom";

import Home from '../components/Home/Home.tsx';
import Contact from '../components/Home/Contact.tsx';
import NotFound from '../components/Home/NotFound.tsx';
import Layout from "../components/layout.tsx";
import InvoiceList from "../components/Invoice/invoiceList.tsx";
import InvoiceViewer from "../components/Invoice/InvoiceViewer.tsx";
import Dashboard from '../components/dashboard';
import BrandList from "../components/Brand/BrandList.tsx";
import SupplierList from "../components/Supplier/SupplierList.tsx";
import ViewBrandForm from "../components/Brand/ViewBrandForm.tsx";  // todo - needs to be specifically a brand form - create factory function called ViewBrandForm to encapsulate the factory element
import BuyableList from "../components/Buyable/BuyableList.tsx";
import ViewBuyableForm from "../components/Buyable/ViewBuyableForm.tsx";
import ViewSupplierForm from "../components/Supplier/ViewSupplierForm.tsx";
import IngredientList from "../components/Ingredient/IngredientList.tsx";
import ViewIngredientForm from "../components/Ingredient/ViewIngredientForm.tsx";
import ViewRecipeForm from "../components/Recipe/ViewRecipeForm.tsx";
import RecipeList from "../components/Recipe/RecipeList.tsx";
import LabourerList from "../components/Labourer/LabourerList.tsx";
import ViewLabourerForm from "../components/Labourer/ViewLabourerForm.tsx";


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
                path: '/ingredient/all',
                element: <IngredientList/>,
            },
            {
                path: '/ingredient/:id',
                element: <ViewIngredientForm/>,
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
            },
            {
                path: '/recipe/all',
                element: <RecipeList/>
            },
            {
                path: '/recipe/:id',
                element: <ViewRecipeForm/>
            },
            {
                path: '/labourer/all',
                element: <LabourerList/>
            },

            {
                path: '/labourer/:id',
                element: <ViewLabourerForm/>
            },

        ]
    },


    // not found element last - only triggers if all others fail to match
    {
        path: '*',
        element: <NotFound/>,
    },

])

export default router;