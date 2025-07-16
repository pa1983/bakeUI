import React from 'react'
import ReactDOM from 'react-dom/client'
import {WebStorageStateStore} from 'oidc-client-ts';
import './index.css'
import {AuthProvider} from "react-oidc-context";  // auth context provided by 3rd party function
import {RouterProvider} from 'react-router-dom';
import "../styles.css"
import router from './routes/routes.tsx'
import {UnitOfMeasureProvider} from "./contexts/UnitOfMeasureContext.tsx";
import {IngredientProvider} from "./contexts/ingredientContext.tsx";

// todo - update redirect for deployment
const cognitoAuthConfig = {
    authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_l4pSAAZYP",
    client_id: "4ph7lbuua09u9qstvlc6mf2i4",
    redirect_uri: "http://localhost:5174",
    response_type: "code",
    scope: "email openid phone",
    userStore: new WebStorageStateStore({store: window.sessionStorage})  // currently storing tokens in sessionStore for security.  Change to localStorage for reduced security but improved convenience
};

const root = ReactDOM.createRoot(document.getElementById("root"));
{/*todo - consider if should have an ingredients context to pull all available ingredients into memory at load time - could run in background and only block dependant components from loading*/
}

root.render(
    <React.StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <UnitOfMeasureProvider>
                <IngredientProvider>
            <RouterProvider router={router}/>
                </IngredientProvider>
            </UnitOfMeasureProvider>
        </AuthProvider>
    </React.StrictMode>
);
