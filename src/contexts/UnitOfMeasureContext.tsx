//  Used to populate and store common data used across most elements, e.g. Title, UOM

import React, {createContext, useState, useEffect, useContext, type ReactNode} from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context'; // Assuming you still use this for auth

// Define your UnitOfMeasure interface
interface IUnitOfMeasure {
    uom_id: number;
    name: string;
    abbreviation: string;
    type: string;
    conversion_factor: number;
    is_base_unit: boolean;
}

// Define the shape of your context value
interface UnitOfMeasureContextType {
    units: IUnitOfMeasure[];
    loading: boolean;
    error: string | null;
}

// Create the context with a default (empty) value
export const UnitOfMeasureContext = createContext<UnitOfMeasureContextType>({
    // todo - add a navbar icon to show that this data is present and up to date; use loading and error to populate an icon
    units: [],
    loading: true,
    error: null,
});

// Create a custom hook for easier consumption
export const useUnitOfMeasures = () => useContext(UnitOfMeasureContext);

interface UnitOfMeasureProviderProps {
    children: ReactNode;
}

export const UnitOfMeasureProvider = ({ children }: UnitOfMeasureProviderProps) => {
    const [units, setUnits] = useState<IUnitOfMeasure[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth(); // Access auth from within the provider

    useEffect(() => {
        const fetchUOMs = async () => {
            // Only fetch if authenticated and we have an access token
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                console.log("Authentication not ready for UOM fetch in context.");  // todo - should auth be in its own context provider?
                setLoading(true); // Still loading until auth is ready
                return;
            }

            try {
                const storedUOMs = localStorage.getItem('unitOfMeasureOptions');
                if (storedUOMs) {
                    // Try to load from localStorage first to prevent re-fetching on every page load
                    setUnits(JSON.parse(storedUOMs));
                    setLoading(false);
                    console.log("Loaded UOMs from localStorage.");
                    return; // Don't fetch from API if found in local storage
                }

                console.log('Fetching Unit of Measure options from API...');
                const res = await axios.get('http://localhost:8000/common/uom', {
                    headers: { Authorization: `Bearer ${auth.user?.access_token}` }
                });
                const fetchedUnits: IUnitOfMeasure[] = res.data;
                setUnits(fetchedUnits);
                localStorage.setItem('unitOfMeasureOptions', JSON.stringify(fetchedUnits)); // Store in localStorage
                console.log("Fetched and stored UOMs from API.");

            } catch (err: any) {
                console.error("Failed to fetch Unit of Measure options:", err);
                setError("Failed to load unit of measure options.");
                setUnits([]); // Clear units on error
            } finally {
                setLoading(false);
            }
        };

        fetchUOMs();
    }, [auth.isAuthenticated, auth.user?.access_token]); // Depend on auth status and token

    const contextValue = {
        units,
        loading,
        error,
    };

    return (

        <UnitOfMeasureContext.Provider value={contextValue}>
            {children}
        </UnitOfMeasureContext.Provider>
    );
};