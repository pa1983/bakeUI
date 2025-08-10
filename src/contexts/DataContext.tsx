import React, {createContext, useContext, useMemo, type ReactNode} from 'react';

import {type ICurrency} from "../models/ICurrency.ts";
import {type ISupplier} from "../models/ISupplier.ts";
import type {IBrand} from "../models/IBrand.ts";
import type {IBuyable} from "../models/IBuyable.ts";
import type {IPickerElement} from "../models/picker.ts";
import {useDataFetcher} from '../hooks/useDataFetcher';
import type {IIngredient} from "../models/IIngredient.ts"; // Import the new hook

// --- Updated Context Type ---
// Reflects the new granular loading/error states and refetch functions
interface DataContextType {
    currencies: ICurrency[];
    suppliers: ISupplier[];
    brands: IBrand[];
    buyables: IBuyable[];
    ingredients: IIngredient[];

    PickerSupplierArray: IPickerElement[],
    PickerBrandArray: IPickerElement[],
    PickerCurrencyArray: IPickerElement[],
    PickerBuyableArray: IPickerElement[],
    PickerIngredientArray: IPickerElement[],

    loading: {
        currencies: boolean;
        suppliers: boolean;
        brands: boolean;
        buyables: boolean;
        ingredients: boolean;
    };

    error: {
        currencies: string | null;
        suppliers: string | null;
        brands: string | null;
        buyables: string | null;
        ingredients: string | null;
    };


    refetchCurrencies: () => void;
    refetchSuppliers: () => void;
    refetchBrands: () => void;
    refetchBuyables: () => void;
    refetchIngredients: () => void;

    refetchAllData: () => void;

}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({children}: { children: ReactNode }) => {

    const {
        data: currencies,
        loading: loadingCurrencies,
        error: errorCurrencies,
        refetch: refetchCurrencies
    } = useDataFetcher<ICurrency>('/common/currency');
    const {
        data: suppliers,
        loading: loadingSuppliers,
        error: errorSuppliers,
        refetch: refetchSuppliers
    } = useDataFetcher<ISupplier>('/buyable/supplier/all');
    const {
        data: brands,
        loading: loadingBrands,
        error: errorBrands,
        refetch: refetchBrands
    } = useDataFetcher<IBrand>('/buyable/brand/all');
    const {
        data: buyables,
        loading: loadingBuyables,
        error: errorBuyables,
        refetch: refetchBuyables
    } = useDataFetcher<IBuyable>('/buyable/all');
    const {
        data: ingredients,
        loading: loadingIngredients,
        error: errorIngredients,
        refetch: refetchIngredients
    } = useDataFetcher<IIngredient>('/ingredient/all');  // ?own_organisation=False  <- do i need to pass this or set as a default?

    // --- Memoized Picker Arrays  ---
    const PickerSupplierArray = useMemo((): IPickerElement[] => {
        return suppliers.map((supplier): IPickerElement => ({
            id: supplier.supplier_id,
            title: supplier.supplier_name || "",
            subtitle: supplier.account_number || "",
            imageUrl: '' // todo - add images for Supplier
        }));
    }, [suppliers]);

    const PickerBrandArray = useMemo((): IPickerElement[] => {
        return brands.map((brand): IPickerElement => ({
            id: brand.brand_id,
            title: brand.brand_name,
            subtitle: `${brand.notes || ''}`,
            imageUrl: null
        }));
    }, [brands]);

    const PickerCurrencyArray = useMemo((): IPickerElement[] => {
        return currencies.map((currency): IPickerElement => ({
            id: currency.currency_code,
            title: `${currency.symbol} - ${currency.currency_name}`,
            subtitle: currency.currency_code,
            imageUrl: '' // todo - create image icons for currencies and make them callable by the currency code so no need to for a link saved in currency table
        }));
    }, [currencies]);


    const PickerBuyableArray = useMemo((): IPickerElement[] => {
        return buyables.map((buyable: IBuyable): IPickerElement => ({
            id: buyable.id,
            title: `${buyable.sku} - ${brands.find(brand => brand.brand_id === buyable.brand_id)?.brand_name || '      \n\n'}  -  ${buyable.item_name}`,
            subtitle: buyable.notes,
            imageUrl: null
        }))
    }, [buyables]);

    const PickerIngredientArray = useMemo((): IPickerElement[] => {
        return ingredients.map((ingredient: IIngredient): IPickerElement => ({
            id: ingredient.ingredient_id,
            title: `${ingredient.ingredient_name}`,
            subtitle: ingredient.notes || '',
            imageUrl:  ingredient.images?.length > 0 ? ingredient.images[0].image_url : null
        }))
    }, [ingredients]);


    // --- Refetching Logic ---
    const refetchAllData = () => {
        refetchCurrencies();
        refetchSuppliers();
        refetchBrands();
        refetchBuyables();
        refetchIngredients();
    };

    // --- Assemble the context value ---
    const contextValue: DataContextType = {
        currencies,
        suppliers,
        brands,
        buyables,
        ingredients,
        PickerSupplierArray,
        PickerBrandArray,
        PickerCurrencyArray,
        PickerBuyableArray,
        PickerIngredientArray,
        loading: {
            currencies: loadingCurrencies,
            suppliers: loadingSuppliers,
            brands: loadingBrands,
            buyables: loadingBuyables,
            ingredients: loadingIngredients,
        },
        error: {
            currencies: errorCurrencies,
            suppliers: errorSuppliers,
            brands: errorBrands,
            buyables: errorBuyables,
            ingredients: errorIngredients,
        },
        refetchAllData,
        refetchCurrencies,
        refetchSuppliers,
        refetchBuyables,
        refetchBrands,
        refetchIngredients
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};