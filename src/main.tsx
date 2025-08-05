import React from 'react'
import ReactDOM from 'react-dom/client'
import {WebStorageStateStore} from 'oidc-client-ts'
import './index.css'
import '../src/styles/general.css'
import {AuthProvider} from "react-oidc-context";  // auth context provided by 3rd party function
import {RouterProvider} from 'react-router-dom';
import "../styles.css"
import router from './routes/routes.tsx'
import {UnitOfMeasureProvider} from "./contexts/UnitOfMeasureContext.tsx";
import {IngredientProvider} from "./contexts/ingredientContext.tsx";
import {FlashProvider} from "./contexts/FlashContext.tsx";
import {CustomAlertProvider} from "./contexts/CustomAlertContext.tsx";
import {pdfjs} from 'react-pdf';
import {InvoiceProvider} from "./contexts/InvoiceContext.tsx";
import {ShortcutProvider} from './contexts/ShortcutContext.tsx';

// Import required CSS for react-pdf pages
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source path
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

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
        <FlashProvider>
            <CustomAlertProvider>
                <AuthProvider {...cognitoAuthConfig}>
                    <ShortcutProvider>
                    <UnitOfMeasureProvider>
                        <IngredientProvider>
                            <InvoiceProvider>
                            <RouterProvider router={router}/>
                            </InvoiceProvider>
                        </IngredientProvider>
                    </UnitOfMeasureProvider>
                    </ShortcutProvider>
                </AuthProvider>
            </CustomAlertProvider>
        </FlashProvider>
    </React.StrictMode>
);
