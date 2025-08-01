import React from 'react';
import InvoiceLineItem from './InvoiceLineItem.tsx';

// Based on the 'LineItemRead' interface from our previous discussions
interface LineItem {
    id: number | null;
    description: string;
    cases: number | null;
    units: number | null;
    value_inc_vat: number;
}

// It's good practice to define the props interface for the component
interface InvoiceLineItemsProps {
    line_items: LineItem[];
}

/**
 * component to display a list of invoice line items.
 * @param {InvoiceLineItemsProps} props - The component props.
 * @param {LineItem[]} props.line_items - An array of line item objects.
 */
function InvoiceLineItemsList({ line_items }: InvoiceLineItemsProps) {
    // Handle the case where there are no line items to display
    if (!line_items || line_items.length === 0) {
        return <p className="has-text-grey">No line items for this invoice.</p>;
    }

    return (
        <div className="content">
            {/*todo - find better approach than UL for listing items - UL is ugly*/}
            <ul>
                {line_items.map((item) => (
                    <InvoiceLineItem item={item}
                    key={item.id}/>


                ))}
            </ul>
        </div>
    );
}

export default InvoiceLineItemsList;
