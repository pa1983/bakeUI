// C:/web/bake/src/components/Invoice/InvoiceLineItemsList.tsx

import React, {useEffect, useState, useCallback} from 'react';
import type {LineItemRead} from "../../models/invoice.ts";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import {patchField} from "../../services/commonService.ts";
import {useAuth} from "react-oidc-context";
import useFlash from "../../contexts/FlashContext.tsx";
import InvoiceLineItem from './InvoiceLineItem.tsx'; // This will be our new "dumb" component

interface InvoiceLineItemsProps {
    invoice_id: number;
}

function InvoiceLineItemsList({invoice_id}: InvoiceLineItemsProps) {
    const auth = useAuth();
    const {showFlashMessage} = useFlash();

    const {
        data: fetchedLineItems,
        loading,
        error,
        refetch,
    } = useDataFetcher<LineItemRead[]>(`/invoice/lineitem/all?invoice_id=${invoice_id}`);

    // Use the specific type for state
    const [lineItems, setLineItems] = useState<LineItemRead[]>([]);

    useEffect(() => {
        if (fetchedLineItems) {
            setLineItems(fetchedLineItems);
        }
    }, [fetchedLineItems]);

    // Optimistically update the local UI state
    const handleChange = useCallback((id: number, fieldName: string, value: any) => {
        setLineItems(currentList =>
            currentList.map(item =>
                item.id === id ? {...item, [fieldName]: value} : item
            )
        );
    }, []);

    // Persist changes to the database
    const handleEdit = useCallback(async (id: number, fieldName: string, value: any) => {
        const originalItem = fetchedLineItems?.find(i => i.id === id);
        if (!originalItem || String(originalItem[fieldName as keyof LineItemRead]) === String(value)) {
            return; // No change, no need to save
        }

        if (!auth.user?.access_token) return;
        const apiEndpoint = "invoice/lineitem";

        try {
            await patchField(auth.user.access_token, id, fieldName, value, apiEndpoint);
            showFlashMessage('Saved!', 'success', 1000);
        } catch (err) {
            showFlashMessage(err instanceof Error ? err.message : 'Failed to save changes', 'danger');
            refetch(); // Revert optimistic UI on failure
        }
    }, [fetchedLineItems, auth.user, showFlashMessage, refetch]);

    const handleDelete = useCallback(async (id: number) => {
        // The actual delete logic is in the DeleteElement component.
        // We just need to refetch the list after a successful deletion.
        console.log(`Refreshing list after deletion of item ${id}`);
        refetch();
    }, [refetch]);

    if (loading && !lineItems.length) {
        return <p>Loading line items...</p>;
    }

    if (error) {
        return <div className="notification is-danger">Error loading line items: {error}</div>;
    }

    return (
        <div className="content">
            <div className="line-items-container">
                {lineItems.map((item) => (
                    <InvoiceLineItem
                        key={item.id}
                        // Pass the correct props that our "dumb" form component expects
                        formData={item}
                        onChange={(fieldName, value) => handleChange(item.id, fieldName, value)}
                        onEdit={(fieldName, value) => handleEdit(item.id, fieldName, value)}
                        onDelete={() => handleDelete(item.id)}
                        // Provide stubs for other required props
                        onSave={() => {}}
                        onCancel={() => {}}
                        isSaving={false} // This could be enhanced to track per-item saving state if needed
                        isModal={true}
                    />
                ))}
            </div>
        </div>
    );
}

export default InvoiceLineItemsList;