import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

// Define the type for an ingredient (assuming IngredientRead from your form component)
// todo - change to refer to models file - should mostly be defined there already
interface UnitOfMeasure {
    uom_id: number;
    name: string;
    abbreviation: string;
    type: string;
    conversion_factor: number;
    is_base_unit: boolean;
}

interface OrganisationRead {
    organisation_id: number | null;
    organisation_name: string;
    contact_email: string;
}

interface ImageRead {
    image_id: number;
    image_url: string;
    file_name: string;
    file_ext: string;
    mime_type: string;
    file_size: number;
    alt_text: string | null;
    caption: string | null;
    created_timestamp: string;
    modified_timestamp: string;
    organisation_id: number | null;
    s3_key: string;
}

interface IngredientImageRead {
    ingredient_image_id: number;
    ingredient_id: number;
    image_id: number;
    sort_order: number;
    image: ImageRead;
}

interface IngredientRead {
    ingredient_id: number;
    ingredient_name: string;
    standard_uom_id: number;
    density: number | null;
    organisation_id: number | null;
    notes: string | null;
    created_timestamp: string;
    modified_timestamp: string;
    standard_uom: UnitOfMeasure;
    organisation: OrganisationRead | null;
    image_links: IngredientImageRead[];
    images: ImageRead[];
}


// Define the shape of your context value
interface IngredientContextType {
    ingredients: IngredientRead[];
    loadingIngredients: boolean;
    ingredientError: string | null;
    refetchIngredients: () => void; // Function to manually trigger a refresh
}

// Create the context
const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

// Create a custom hook to use the ingredient context
export const useIngredients = () => {
    const context = useContext(IngredientContext);
    if (context === undefined) {
        throw new Error('useIngredients must be used within an IngredientProvider');
    }
    return context;
};

// Create the Provider component
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
            const response = await axios.get('http://localhost:8000/ingredient/ingredients?own_organisation=False', {
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