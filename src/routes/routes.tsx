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
import RecipeCostAnalysisWrapper from "../components/RecipeCostAnalysis/RecipeCostAnalysisWrapper.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";



// wrapper to extract the ID param and pass as a prop to the cost analysis component, removing need for complex logic in the component  // todo - move this out

const router = createBrowserRouter([
    // --- Group 1: Public Routes ---
    // These are accessible to everyone and do not use the main authenticated Layout.
    // { path: "/login", element: <Login /> },
    { path: "/about", element: <Home /> },
    { path: "/contact", element: <Contact /> },
    {path: "/logged-out", element: <Home />},

    // --- Group 2: Protected Application Routes ---
    // This single entry point protects all child routes. If the user is not
    // authenticated, <ProtectedRoute> will redirect them to "/login".
    // Otherwise, it renders the main <Layout> which handles the nested routes.
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Dashboard /> },

            // Recipes
            { path: "recipe/all", element: <RecipeList /> },
            { path: "recipe/:id", element: <ViewRecipeForm /> },
            { path: "recipe/:id/costanalysis", element: <RecipeCostAnalysisWrapper /> },

            // Ingredients
            { path: "ingredient/all", element: <IngredientList /> },
            { path: "ingredient/:id", element: <ViewIngredientForm /> },

            // Buyables, Brands, and Suppliers
            { path: "buyable/all", element: <BuyableList /> },
            { path: "buyable/:id", element: <ViewBuyableForm /> },
            { path: "buyable/brand/all", element: <BrandList /> },
            { path: "buyable/brand/:id", element: <ViewBrandForm isModal={false} /> },
            { path: "buyable/supplier/all", element: <SupplierList /> },
            { path: "buyable/supplier/:id", element: <ViewSupplierForm /> },

            // Labour
            { path: "labourer/all", element: <LabourerList /> },
            { path: "labourer/:id", element: <ViewLabourerForm /> },

            // Invoices
            { path: "invoice/invoices", element: <InvoiceList /> },
            { path: "invoice/:invoice_id", element: <InvoiceViewer /> },


        ],
    },

    // --- Catch-all for any route that doesn't match ---
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;