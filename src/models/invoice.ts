// These are placeholder interfaces for models imported in your Python code
// but not fully defined. They are also in snake_case for consistency.
export interface Image {
    image_id: number;
    url: string;
    // ... other image properties
}

export interface Organisation {
    organisation_id: number;
    name: string;
    // ... other organisation properties
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
    currency: string;
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
    organisation?: Organisation;
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
    status: InvoiceStatus;
    image: Image;
}