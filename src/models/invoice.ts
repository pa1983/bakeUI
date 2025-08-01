// These are placeholder interfaces for models imported in your Python code
// but not fully defined. They are also in snake_case for consistency.

import type { Currency } from './currency.ts';
import type {OrganisationRead} from "./organisation.ts";

export interface Image {
    image_id: number;
    url: string;
    // ... other image properties
}

/**
 * Corresponds to the Python `InvoiceStatus` model.
 * List of invoice stati to describe current invoice status.
 */
export interface InvoiceStatus {
    name: string;
    display_name: string;
    description: string;
    sort_order: number;
}

/**
 * Corresponds to the Python `ParsedLineItem` model.
 * Definition of invoice line item fields to be extracted.
 */
export interface ParsedLineItem {
    cases?: number;
    units?: number;
    description: string;
    size?: string;
    code?: string;
    value_ex_vat: number;
    value_inc_vat: number;
    vat_percentage: number;
    is_delivery: boolean;
}

/**
 * Corresponds to the Python `ParsedInvoiceDetails` model.
 * Definition of invoice meta fields to be extracted from the invoice.
 */
export interface ParsedInvoiceDetails {
    supplier_name?: string;
    supplier_id?: number;
    customer_account_number?: string;
    invoice_number: string;
    user_reference?: string;
    supplier_reference?: string;
    calculated_total: number;
    invoice_total: number;
    delivery_cost: number;
    parsed_currency: string;
    document_type: string;
    invoice_date: string; // ISO 8601 date string
    confidence_score: number;
}

/**
 * Corresponds to the Python `ParsedInvoice` model.
 * Container for all data returned by the parsing engine.
 */
export interface ParsedInvoice {
    line_items: ParsedLineItem[];
    invoice_details: ParsedInvoiceDetails;
}

/**
 * Corresponds to the Python `LineItem` model.
 * Extends ParsedLineItem with database-specific fields.
 */
export interface LineItem extends ParsedLineItem {
    id?: number;
    invoice_id?: number;
    // The 'invoice' property is omitted here to prevent circular type definitions.
}

/**
 * Corresponds to the Python `Invoice` model.
 * Final model, including system-generated meta fields, to be saved to the database.
 */
export interface Invoice extends ParsedInvoiceDetails {
    id?: number;
    date_added: string; // ISO 8601 date string
    organisation_id?: number;
    organisation?: OrganisationRead;
    date_modified: string; // ISO 8601 date string
    parse_duration_ms: number;
    parse_ai_tokens: number;
    status: string; // Corresponds to InvoiceStatus.name
    invoice_status: InvoiceStatus;
    received_date?: string; // ISO 8601 date string
    notes?: string;
    image_id?: number;
    invoice_image?: Image;
    line_items: LineItem[];
}

/**
 * Corresponds to the Python `InvoiceListResponse` model.
 * Used for API calls to display a list of invoices.
 */
export interface InvoiceListResponse {
    id: number;
    date_added: string; // ISO 8601 date string
    date_modified: string; // ISO 8601 date string
    supplier_name?: string;
    invoice_number?: string;
    status: InvoiceStatus;  // could change this to status code and use the status contect to get the display name?
    image: Image;
}


/**
 * Based on the Python ImageBase SQLModel.
 * Represents common metadata for files stored in S3.
 */
export interface ImageBase {
    file_name: string;
    file_ext: string;
    mime_type: string;
    file_size: number;
    alt_text: string | null;
    caption: string | null;
    created_timestamp: string; // Corresponds to Python's datetime
    modified_timestamp: string; // Corresponds to Python's datetime
    organisation_id: number | null;
    s3_key: string;
}

/**
 * Based on the Python ImageInvoiceRead Pydantic model.
 * Represents image data for an invoice.
 */
export interface ImageInvoiceRead extends ImageBase {
    image_id: number;
}

/**
 * Based on the Python InvoiceStatus SQLModel.
 */
export interface InvoiceStatus {
    name: string;
    display_name: string;
    description: string;
    sort_order: number;
}

/**
 * Based on the Python LineItemRead Pydantic model.
 */
export interface LineItemRead {
    id: number | null;
    cases: number | null;
    units: number | null;
    description: string;
    size: string | null;
    code: string | null;
    value_ex_vat: number;
    value_inc_vat: number;
    vat_percentage: number;
    is_delivery: boolean;
}

/**
 * Based on the Python ParsedInvoiceDetails SQLModel.
 * Contains fields extracted directly from the invoice document.
 */
export interface ParsedInvoiceDetails {
    supplier_name: string | null;
    customer_account_number: string | null;
    invoice_number: string | null;
    user_reference: string | null;
    supplier_reference: string | null;
    calculated_total: number | null;
    invoice_total: number | null;
    delivery_cost: number | null;
    parsed_currency: string | null;
    document_type: string;
    invoice_date: string | null; // Corresponds to Python's datetime
    confidence_score: number;
}

/**
 * The main interface for an incoming invoice data transfer object (DTO).
 * Based on the Python InvoiceRead Pydantic model.
 */
export interface InvoiceRead extends ParsedInvoiceDetails {
    id: number;
    date_added: string | null; // Corresponds to Python's datetime
    date_modified: string | null; // Corresponds to Python's datetime
    parse_duration_ms: number | null;
    parse_ai_tokens: number | null;
    received_date: string | null; // Corresponds to Python's datetime
    notes: string | null;
    supplier_id: number | null;
    invoice_image: ImageInvoiceRead | null;
    line_items: LineItemRead[];
    currency_code: string | null;
    status: string | null;
}
// todo - check for duplication of interface definitions
