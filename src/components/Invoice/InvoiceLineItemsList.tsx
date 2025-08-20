// C:/web/bake/src/components/Invoice/InvoiceLineItemsList.tsx

import {useEffect, useState, useCallback} from 'react';
import type {ILineItem} from "../../models/invoice.ts";
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
    } = useDataFetcher<ILineItem>(`/invoice/lineitem/all?invoice_id=${invoice_id}`);

    // Use the specific type for state
    const [lineItems, setLineItems] = useState<ILineItem[]>([]);

    useEffect(() => {
        if (fetchedLineItems) {
            setLineItems(fetchedLineItems);
        }
    }, [fetchedLineItems]);

    // Optimistically update the local UI state, assuming that the update to DB will be successful.
    // Restricts values and fields to those in the type interface.
    const handleChange = useCallback(
        <K extends keyof ILineItem>(id: number | null, fieldName: K, value: ILineItem[K]) => {
            if (!id) return;  
            setLineItems(currentList =>
                currentList.map(item =>
                    item.id === id ? { ...item, [fieldName]: value } : item
                )
            );
        },
        []
    );

    // Persist changes to the database
    const handleEdit = useCallback(
        async <K extends keyof ILineItem>(id: number | null, fieldName: K, value: ILineItem[K]) => {
            if (!id) return;
            const originalItem = fetchedLineItems?.find(i => i.id === id);
            if (!originalItem || originalItem[fieldName] === value) {
                return; // No change, no need to save.
            }

            if (!auth.user?.access_token) return;
            const apiEndpoint = "invoice/lineitem";

            try {
                await patchField(auth.user.access_token, id, fieldName, value, apiEndpoint);
                showFlashMessage('Saved!', 'success');
            } catch (err) {
                showFlashMessage(err instanceof Error ? err.message : 'Failed to save changes', 'danger');
                refetch(); // Revert optimistic UI on failure
            }
        },
        [fetchedLineItems, auth.user, showFlashMessage, refetch]
    );

    const handleDelete = useCallback(async (id: number | null) => {
        // The actual delete logic is in the DeleteElement component.
        // We just need to refetch the list after a successful deletion.
        if (!id) return;
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
                {/*// First, keep only items that have an ID to satisfy typechecking on callbacks*/}
                {/*// Then, map over the filtered array*/}
                {lineItems
                    .filter(item => item.id)
                    .map((item) => (
                        <InvoiceLineItem
                            key={item.id}
                            formData={item}
                            onChange={(fieldName, value) => handleChange(item.id, fieldName, value)}
                            onEdit={(fieldName, value) => handleEdit(item.id, fieldName, value)}
                            onDelete={() => handleDelete(item.id)}
                            // stubs for other required props
                            onSave={() => {}}
                            onCancel={() => {}}
                            isSaving={false}
                            isModal={true}
                        />
                    ))}
            </div>
        </div>
    );
}

export default InvoiceLineItemsList;