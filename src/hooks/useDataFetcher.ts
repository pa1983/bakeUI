

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

import config from '../services/api.ts';
const API_BASE_URL = config.API_URL;  // todo - move this to a config file to all for global change of api base



/**
 * A generic hook to fetch data from API endpoint, used in the DataContext provider.
 * It manages its own loading, error, and data states.
 * @param endpointPath The API path to fetch data from (e.g., '/common/currency').
 * @param initialData The initial state for the data array.
 * @returns An object containing the fetched data, loading state, error state, and a refetch function.
 */

export const useDataFetcher = <T>(endpoint: string | null) => {
    const auth = useAuth();
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {

        //  Don't fetch if auth isn't ready.
        if (auth.isLoading || !auth.user?.access_token) {
            console.log(`UseDataFetcher: auth not ready for fetchData.`);
            setLoading(false);
            return;
        }
        // If the endpoint is null, don't do anything - prevents need for checking if endpoint is ready before use in calling functions
        if (!endpoint) {
            console.log(`UseDataFetcher: endpoint is null.`);
            setLoading(false); // No longer loading
            setData(null); // Ensure data is cleared
            return;

        }
        console.log(`fetchingData within DataFetcher hook for endpoint: ${endpoint}`);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${auth.user.access_token}` },
            });
            setData(response.data.data || []);
            // console.log(`data in useDataFetcher: `);
            // console.log(response);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred';
            console.error(`Failed to fetch from ${endpoint}:`, err);
            setError(`Failed to fetch data: ${errorMessage}`);
            setData(null); // Reset to initial state on error
        } finally {
            setLoading(false);
        }

    }, [endpoint, auth]);

    // ... rest of the hook (useEffect, etc.)

    // The refetch function should also have this guard
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return { data, loading, error, refetch };
};
//
//
// export const useDataFetcher = <T>(endpointPath: string, initialData: T[] = []) => {
//     const auth = useAuth();
//     const [data, setData] = useState<T[]>(initialData);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [trigger, setTrigger] = useState(0);
//
//     const refetch = () => setTrigger(prev => prev + 1);
//
//     useEffect(() => {
//         // Don't fetch if authentication is still loading or user is not signed in.
//         if (auth.isLoading || !auth.user?.access_token) {
//             setLoading(false);
//             return;
//         }
//
//         const fetchData = async () => {
//             console.log(`fetchingData within DataFetcher hook for endpoint: ${endpointPath}`);
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(`${API_BASE_URL}${endpointPath}`, {
//                     headers: { Authorization: `Bearer ${auth.user.access_token}` },
//                 });
//                 setData(response.data.data || []);
//                 // console.log(`data in useDataFetcher: `);
//                 // console.log(response);
//             } catch (err: any) {
//                 const errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred';
//                 console.error(`Failed to fetch from ${endpointPath}:`, err);
//                 setError(`Failed to fetch data: ${errorMessage}`);
//                 setData(initialData); // Reset to initial state on error
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, [auth.isLoading, auth.user, trigger, endpointPath]); // Re-run if auth or trigger changes
//
//     return { data, loading, error, refetch };
// };