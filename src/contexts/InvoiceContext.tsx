import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

import {type Currency} from "../models/currency.ts";
import {type Supplier} from "../models/supplier.ts";
import type {Brand} from "../models/brand.ts";

interface InvoiceContextType {
    currencies: Currency[];
    suppliers: Supplier[];
    brands: Brand[];
    invoiceFormDataError: string|null;
    loadingInvoiceFormData: boolean;
    refetchInvoiceFormData: () => void; // Function to manually trigger a refresh
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// custom hook to use the ingredient context
export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoices must be used within an InvoiceProvider');
    }
    return context;
};

// Provider component
export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingInvoiceFormData, setLoadingInvoiceFormData] = useState<boolean>(true);
    const [invoiceFormDataError, setInvoiceFormDataError] = useState<string | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState<number>(0); // To manually re-trigger fetch

    const fetchInvoiceFormData = async () => {
        setLoadingInvoiceFormData(true);
        setInvoiceFormDataError(null);
        try {
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                console.warn("Authentication token not available. Waiting for auth.");
                // If not authenticated, don't set error, just wait.
                setLoadingInvoiceFormData(false);
                return;
            }

            console.log("Fetching invoice data from API...");
            const response = await axios.get('http://localhost:8000/invoice/formdata', {
                headers: { Authorization: `Bearer ${auth.user?.access_token}` }
            });
            setCurrencies(response.data.data.currencies);
            setSuppliers(response.data.data.suppliers);
            setBrands(response.data.data.brands);
            console.log("Invoice form data fetched successfully.");
        } catch (err: any) {
            console.error('Failed to fetch invoiceFormData:', err);
            setInvoiceFormDataError("Failed to fetch invoiceFormData: " + (err.response?.data?.detail || err.message));
            setCurrencies([]); // Clear variable on error
            setSuppliers([]);
            setBrands([]);
        } finally {
            setLoadingInvoiceFormData(false);
        }
    };

    // Effect to fetch ingredients
    useEffect(() => {
        // Only fetch if authenticated and not already loading, or if fetchTrigger changes
        if (auth.isAuthenticated && !auth.isLoading) {
            fetchInvoiceFormData();
        }
    }, [auth.isAuthenticated, auth.isLoading, auth.user?.access_token, fetchTrigger]); // Depend on auth states and trigger

    // Function to expose for manual re-fetching
    const refetchInvoiceFormData = () => {
        setFetchTrigger(prev => prev + 1); // Increment to trigger useEffect
    };

    const contextValue: InvoiceContextType = {
        currencies,
        suppliers,
        brands,
        invoiceFormDataError,
        loadingInvoiceFormData,
        refetchInvoiceFormData
    };

    return (
        <InvoiceContext.Provider value={contextValue}>
            {children}
        </InvoiceContext.Provider>
    );
};