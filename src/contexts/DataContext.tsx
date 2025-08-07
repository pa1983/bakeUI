import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

import { type Currency } from "../models/currency.ts";
import { type Supplier } from "../models/supplier.ts";
import type { Brand } from "../models/brand.ts";
import type { Buyable } from "../models/buyable.ts";
import type { IPickerElement } from "../models/picker.ts";
import { useDataFetcher } from '../hooks/useDataFetcher'; // Import the new hook

// --- Updated Context Type ---
// Reflects the new granular loading/error states and refetch functions
interface DataContextType {
    currencies: Currency[];
    suppliers: Supplier[];
    brands: Brand[];
    buyables: Buyable[];

    PickerSupplierArray: IPickerElement[],
    PickerBrandArray: IPickerElement[],
    PickerCurrencyArray: IPickerElement[],
    PickerBuyableArray: IPickerElement[],

    loading: {
        currencies: boolean;
        suppliers: boolean;
        brands: boolean;
        buyables: boolean;
    };

    error: {
        currencies: string | null;
        suppliers: string | null;
        brands: string | null;
        buyables: string | null;
    };


    refetchCurrencies: () => void;
    refetchSuppliers: () => void;
    refetchBrands: () => void;
    refetchBuyables: () => void;

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

export const DataProvider = ({ children }: { children: ReactNode }) => {

    const { data: currencies, loading: loadingCurrencies, error: errorCurrencies, refetch: refetchCurrencies } = useDataFetcher<Currency>('/common/currency');
    const { data: suppliers, loading: loadingSuppliers, error: errorSuppliers, refetch: refetchSuppliers } = useDataFetcher<Supplier>('/common/supplier');
    const { data: brands, loading: loadingBrands, error: errorBrands, refetch: refetchBrands } = useDataFetcher<Brand>('/buyable/brand/all');
    const { data: buyables, loading: loadingBuyables, error: errorBuyables, refetch: refetchBuyables } = useDataFetcher<Buyable>('/buyable/all');

    // --- Memoized Picker Arrays  ---
    const PickerSupplierArray = useMemo((): IPickerElement[] => {
        return suppliers.map((supplier): IPickerElement => ({
            id: supplier.supplier_id,
            title: supplier.supplier_name,
            subtitle: supplier.account_number,
            imageUrl: '' // todo - add images for supplier
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
            return buyables.map((buyable: Buyable): IPickerElement => ({
                id: buyable.id,
                title: `${buyable.sku} - ${ brands.find(brand => brand.brand_id === buyable.brand_id)?.brand_name || '      \n\n'}  -  ${buyable.item_name}`,
                subtitle: buyable.notes,
                imageUrl: null
            }))
        }, [buyables]);



    // --- Refetching Logic ---
    const refetchAllData = () => {
        refetchCurrencies();
        refetchSuppliers();
        refetchBrands();
        refetchBuyables();
    };

    // --- Assemble the context value ---
    const contextValue: DataContextType = {
        currencies,
        suppliers,
        brands,
        buyables,
        PickerSupplierArray,
        PickerBrandArray,
        PickerCurrencyArray,
        PickerBuyableArray,
        loading: {
            currencies: loadingCurrencies,
            suppliers: loadingSuppliers,
            brands: loadingBrands,
            buyables: loadingBuyables,
        },
        error: {
            currencies: errorCurrencies,
            suppliers: errorSuppliers,
            brands: errorBrands,
            buyables: errorBuyables,
        },
        refetchAllData,
        refetchCurrencies,
        refetchSuppliers,
        refetchBuyables,
        refetchBrands
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};