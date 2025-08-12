import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';
// import type {UnitOfMeasure} from "../models/uom.ts";
// import {OrganisationRead} from "../models/organisation.ts";
// import {ImageRead} from "../models/IImage.ts";
// import {IngredientImageRead} from "../models/IIngredient.ts";
import {type IngredientRead} from "../models/IIngredient.ts";
import {fetchImages} from "../services/imageService.ts";

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
    const [fullUrl, setFullUrl] = useState<string|null>(null);

    // todo - populate the fullurl on load and fetch images

    // Effect to fetch ingredients
    useEffect(() => {
        // Only fetch if authenticated and not already loading, or if fetchTrigger changes
        if (auth.isAuthenticated && !auth.isLoading) {
            fetchImages();
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