/**
 * Based on the Python `ImageBase` SQLModel.
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
 * Based on the Python `ImageInvoiceRead` Pydantic model.
 * Represents image data specifically for an invoice.
 */
export interface ImageInvoiceRead extends ImageBase {
    image_id: number;
}

/**
 * Based on the Python `InvoiceStatus` SQLModel.
 * Describes the possible statuses of an invoice.
 */
export interface InvoiceStatus {
    name: string;
    display_name: string;
    description: string;
    sort_order: number;
}

/**
 * Based on the Python `ParsedInvoiceDetails` SQLModel.
 * Contains invoice-level fields extracted directly from the document.
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
    invoice_date: string | null; // ISO 8601 date string
    confidence_score: number;
}

/**
 * Based on the Python `LineItemRead` SQLModel.
 * Represents a fully formed line item with database ID and linked buyable info.
 * This version correctly reflects the optional fields from the Python model.
 */
export interface ILineItem {
    id: number | null;
    invoice_id: number | null;
    cases: number | null;
    units: number | null;
    description: string | null;
    size: string | null;
    code: string | null;
    value_ex_vat: number | null;
    value_inc_vat: number | null;
    vat_percentage: number | null;
    is_delivery: boolean | null;
    buyable_id: number | null;
    buyable_quantity: number | null; // JavaScript number can handle Python's Decimal for many use cases
    unit_cost: number | null;      // Consider using a string or a library like decimal.js if precision is critical
}

export function createEmptyLineItem(): ILineItem {
    return {
        id: 0,
        invoice_id: 0,
        cases: 0,
        units: 0,
        description: "",
        size: "",
        code: "",
        value_ex_vat: 0,
        value_inc_vat: 0,
        vat_percentage: 0,
        is_delivery: false,
        buyable_id: null,
        buyable_quantity: null,
        unit_cost: null,
    };
}

/**
 * The main interface for a full invoice DTO.
 * Based on the Python `InvoiceRead` SQLModel.
 * This version correctly types the nested `invoice_status` object.
 */
export interface InvoiceRead extends ParsedInvoiceDetails {
    id: number;
    date_added: string | null;
    date_modified: string | null;
    parse_duration_ms: number | null;
    parse_ai_tokens: number | null;
    received_date: string | null;
    notes: string | null;
    supplier_id: number | null;
    currency_code: string | null;

    // --- Nested relationships ---
    invoice_status: InvoiceStatus | null;
    invoice_image: ImageInvoiceRead | null;
    line_items: ILineItem[];
}

/**
 * Based on the Python `InvoiceListResponse` model.
 * A slimmed-down model used for displaying a list of invoices, optimising payload size.
 */
export interface InvoiceListResponse {
    id: number;
    date_added: string; // ISO 8601 date string
    date_modified: string; // ISO 8601 date string
    supplier_name: string | null;
    invoice_number: string | null;
    status: InvoiceStatus;
    image: ImageInvoiceRead;
}