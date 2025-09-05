import {type JSX, useEffect} from 'react';
import { useAuth } from 'react-oidc-context';
import LoadingSpinner from "./Utility/LoadingSpinner.tsx";

/**
 * A gatekeeper component that protects routes from unauthenticated access.
 * It uses the `react-oidc-context` to automatically handle the login flow.
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();

    useEffect(() => {
        // Only trigger the redirect if the auth state is no longer loading and the user is not authenticated.
        if (!auth.isLoading && !auth.isAuthenticated) {
            void auth.signinRedirect();
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.signinRedirect]);

    if (auth.isLoading) {
        return <LoadingSpinner/>;
    }

    // If the user is authenticated, render the requested child component.
    if (auth.isAuthenticated) {
        return children;
    }
    return <LoadingSpinner/>;
};

export default ProtectedRoute;