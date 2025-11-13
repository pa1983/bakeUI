/**
 * Represents the data structure for reading a production log entry.
 * This mirrors the `ProductionLogRead` Pydantic model from the backend.
 */
export interface IProductionLog {
    id: number;
    recipe_id: number | null;
    production_type_id: number;
    number_of_batches: number;
    quantity: string; // Using string is safest for Decimal types from Python
    uom_id: number;
    created_at: string | null; // ISO 8601 datetime string
    updated_at: string | null; // ISO 8601 datetime string
    notes: string | null
}

/**
 * Represents the data structure for updating a production log entry.
 * All fields are optional, allowing for partial updates.
 * This mirrors the `ProductionLogUpdate` Pydantic model from the backend.
 */
export interface IProductionLogUpdate {
    recipe_id?: number;
    production_type_id?: number;
    number_of_batches?: number;
    quantity?: string;
    uom_id?: number;
    notes?: string;
}

/**
 * Represents the editable fields of a production log entry, including the ID.
 * This is used for forms where the ID is present but created_at/updated_at are not editable.
 */
export type IProductionLogEditable = Omit<IProductionLog, 'created_at' | 'updated_at'>;

/**
 * Creates and returns an empty IProductionLog object.
 * This is useful for initializing state for a new production log entry form.
 * @returns {IProductionLog} An empty IProductionLog object with default values.
 */
export const createEmptyProductionLog = (): IProductionLog => {
    return {
        id: 0,
        recipe_id: 0,
        production_type_id: 0,
        number_of_batches: 1,
        quantity: '',
        uom_id: 9,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: ''

    };
};