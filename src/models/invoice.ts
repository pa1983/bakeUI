
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


export interface ImageInvoiceRead extends ImageBase {
    image_id: number;
}

export interface InvoiceStatus {
    name: string;
    display_name: string;
    description: string;
    sort_order: number;
}


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
    invoice_date: string | null;
    confidence_score: number;
}

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
    buyable_quantity: number | null;
    unit_cost: number | null;
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

    invoice_status: InvoiceStatus | null;
    invoice_image: ImageInvoiceRead | null;
    line_items: ILineItem[];
}


export interface InvoiceListResponse {
    id: number;
    date_added: string;
    date_modified: string;
    supplier_name: string | null;
    invoice_number: string | null;
    status: InvoiceStatus;
    image: ImageInvoiceRead;
    calculated_total: string | null;
    invoice_total: string | null;
    line_items_count: number;
    currency_code: string | null;
}