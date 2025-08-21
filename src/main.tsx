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

import {FlashProvider} from "./contexts/FlashContext.tsx";
import {CustomAlertProvider} from "./contexts/CustomAlertContext.tsx";
import {pdfjs} from 'react-pdf';
import {DataProvider} from "./contexts/DataContext.tsx";
import {KeyboardShortcutProvider} from './contexts/KeyboardShortcutContext.tsx';

// Import required CSS for react-pdf pages
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const COGNITO_AUTHORITY = import.meta.env.VITE_COGNITO_AUTHORITY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

// Set the worker source path for pdf viewer
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const cognitoAuthConfig = {
    authority: COGNITO_AUTHORITY,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    response_type: "code",
    scope: "email openid phone",
    userStore: new WebStorageStateStore({store: window.sessionStorage})};  // currently storing tokens in sessionStore for security.  Change to localStorage for reduced security but improved convenience


// Ddedicated component to compose all providers- makes the main file cleaner and the provider setup reusable.
const AppProviders = ({ children }: { children: React.ReactNode }) => (
    <React.StrictMode>
        <FlashProvider>
            <CustomAlertProvider>
                <AuthProvider {...cognitoAuthConfig}>
                    <KeyboardShortcutProvider>
                        <UnitOfMeasureProvider>
                            {/* Your TODO about an ingredients context is a great idea!
                                The DataProvider is the perfect place to implement that
                                data-loading logic. */}
                            <DataProvider>
                                {children}
                            </DataProvider>
                        </UnitOfMeasureProvider>
                    </KeyboardShortcutProvider>
                </AuthProvider>
            </CustomAlertProvider>
        </FlashProvider>
    </React.StrictMode>
);

// Runtime check to ensure the root element exists.
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Fatal Error: The root element with ID 'root' was not found in the DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <AppProviders>
        <RouterProvider router={router} />
    </AppProviders>
);