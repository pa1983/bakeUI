import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

import config from '../services/api.ts';
const API_BASE_URL = config.API_URL;

// Define a type for the params for better type safety.
type FetchParams = Record<string, string | number | boolean | null | undefined>;


/**
 * A generic hook to fetch data from an API endpoint.
 * It manages its own loading, error, and data states.
 * @param endpoint The API path to fetch data from (e.g., '/common/currency'). Can be null to prevent fetching.
 * @param params Optional object of key-value pairs to be sent as URL query parameters.
 * @returns An object containing the fetched data, loading state, error state, and a refetch function.
 */
export const useDataFetcher = <T>(endpoint: string | null, params?: FetchParams) => {
    const auth = useAuth();
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // To prevent re-fetching on every render due to a new params object instance,
    // we serialise it for the dependency array. This is a stable way to check for changes.
    const serializedParams = JSON.stringify(params);

    const fetchData = useCallback(async () => {
        //  Don't fetch if auth isn't ready.
        if (auth.isLoading || !auth.user?.access_token) {
            console.log(`UseDataFetcher: auth not ready for fetchData.`);
            setLoading(false);
            return;
        }
        // If the endpoint is null, don't do anything.
        if (!endpoint) {
            console.log(`UseDataFetcher: endpoint is null.`);
            setLoading(false); // No longer loading
            setData(null); // Ensure data is cleared
            return;
        }
        console.log(`fetchingData within DataFetcher hook for endpoint: ${endpoint} with params: ${serializedParams}`);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${auth.user.access_token}` },
                // Pass the params object to axios. It will be converted to a query string.
                params: params,
            });
            setData(response.data.data || []);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred';
            console.error(`Failed to fetch from ${endpoint}:`, err);
            setError(`Failed to fetch data: ${errorMessage}`);
            setData(null); // Reset to initial state on error
        } finally {
            setLoading(false);
        }
    }, [endpoint, auth.isLoading, auth.user?.access_token, serializedParams]); // Use serializedParams here

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return { data, loading, error, refetch };
};