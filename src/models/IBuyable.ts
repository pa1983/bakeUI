export interface IBuyable {
    id: number;
    brand_id: number | null;
    sku: string;  // Supplier's sku, or user-generated if none is provided
    item_name: string;  // simple user-friendly description of the buyable item
    uom_id: number;
    quantity: string; // Using string is safest for Decimal types
    is_active: boolean;
    notes: string | null;
    created_timestamp: string | null; // e.g., "2025-08-05T20:20:00.000Z"
    modified_timestamp: string | null;
}


export const createEmptyBuyable = (): IBuyable => {
    return {
        id: 0,
        brand_id: null, // Should be updated by the user to a valid ID - restrict in front end to prevent submission of default value
        sku: '',
        item_name: '',
        uom_id: 1, // Should be updated by the user to a valid ID - restrict in front end to prevent submission of default value
        quantity: '0',  // whole number, relative to the uom selected
        is_active: true, // New items are typically active by default
        notes: null,
        created_timestamp: '', // e.g., "2025-08-05T20:20:00.000Z"
        modified_timestamp: ''
    }
};
