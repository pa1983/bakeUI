import {type Currency} from "./currency.ts";

export interface Supplier {
    supplier_id: number;
    supplier_name: string;
    account_number?: string;
    contact_person?: string;
    phone_number?: string;
    email_address?: string;
    address?: string;
    notes?: string;
    currency_code: string;
    minimum_order_value?: number;
    delivery_charge?: number;
    organisation_id: number;
    image_id?: number;

    // Represents the nested Currency object from the relationship
    currency?: Currency;
}