import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';
// import type {UnitOfMeasure} from "../models/uom.ts";
// import {OrganisationRead} from "../models/organisation.ts";
// import {ImageRead} from "../models/image.ts";
// import {IngredientImageRead} from "../models/ingredients.ts";
import {type IngredientRead} from "../models/ingredients.ts";

interface IngredientContextType {
    ingredients: IngredientRead[];
    loadingIngredients: boolean;
    ingredientError: string | null;
    refetchIngredients: () => void; // Function to manually trigger a refresh
}

const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

// custom hook to use the ingredient context
export const useIngredients = () => {
    const context = useContext(IngredientContext);
    if (context === undefined) {
        throw new Error('useIngredients must be used within an IngredientProvider');
    }
    return context;
};

// Provider component
export const IngredientProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();
    const [ingredients, setIngredients] = useState<IngredientRead[]>([]);
    const [loadingIngredients, setLoadingIngredients] = useState<boolean>(true);
    const [ingredientError, setIngredientError] = useState<string | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState<number>(0); // To manually re-trigger fetch

    const fetchIngredients = async () => {
        setLoadingIngredients(true);
        setIngredientError(null);
        try {
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                console.warn("Authentication token not available. Waiting for auth.");
                // If not authenticated, don't set error, just wait.
                setLoadingIngredients(false);
                return;
            }

            console.log("Fetching ingredients from API...");
            const response = await axios.get('http://localhost:8000/ingredient/all?own_organisation=False', {
                headers: { Authorization: `Bearer ${auth.user?.access_token}` }
            });
            setIngredients(response.data.items);
            console.log("Ingredients fetched successfully.");
        } catch (err: any) {
            console.error('Failed to fetch ingredients:', err);
            setIngredientError("Failed to fetch ingredients: " + (err.response?.data?.detail || err.message));
            setIngredients([]); // Clear ingredients on error
        } finally {
            setLoadingIngredients(false);
        }
    };

    // Effect to fetch ingredients
    useEffect(() => {
        // Only fetch if authenticated and not already loading, or if fetchTrigger changes
        if (auth.isAuthenticated && !auth.isLoading) {
            fetchIngredients();
        }
    }, [auth.isAuthenticated, auth.isLoading, auth.user?.access_token, fetchTrigger]); // Depend on auth states and trigger

    // Function to expose for manual re-fetching
    const refetchIngredients = () => {
        setFetchTrigger(prev => prev + 1); // Increment to trigger useEffect
    };

    const contextValue: IngredientContextType = {
        ingredients,
        loadingIngredients,
        ingredientError,
        refetchIngredients,
    };

    return (
        <IngredientContext.Provider value={contextValue}>
            {children}
        </IngredientContext.Provider>
    );
};