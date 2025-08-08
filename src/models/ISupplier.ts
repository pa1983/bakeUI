import {type ICurrency} from "./ICurrency.ts";

/** All fields are optional to allow for partial updates, where only the changed fields are sent to the API. */

export interface ISupplier {
    supplier_id: number;
    supplier_name?: string;
    account_number?: string;
    contact_person?: string;
    phone_number?: string;
    email_address?: string;
    address?: string;
    notes?: string;
    currency_code?: string;
    minimum_order_value?: number;
    delivery_charge?: number;

    // The ID of the associated image. Can be set to null to remove an existing image.
    image_id?: number | null;
}


/**
 * Creates and returns an "empty" Supplier object with default values.
 * for use when pre-populating values in a new Supplier form
 * @returns {ISupplierCreate} A new Supplier object with default values.
 */
export const createEmptySupplier = (): ISupplierCreate => {
    return {
        supplier_id: 0,
        supplier_name: '',
        account_number: '',
        contact_person: '',
        phone_number: '',
        email_address: '',
        address: '',
        notes: '',
        currency_code: 'GBP', // Default since will be most likely use case
        minimum_order_value: 0,
        delivery_charge: 0,
        image_id: null,
    };
};