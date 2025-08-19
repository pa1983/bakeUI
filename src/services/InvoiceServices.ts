import axios from "axios";
import type {InvoiceListResponse, InvoiceRead} from "../models/invoice.ts";
import config from "./api.ts";

// fetch invoice list and ensure it matches the InvoiceListResponse model format
export const fetchInvoices = async (access_token: string): Promise<InvoiceListResponse[]> => {
    try {
        const response = await axios.get<InvoiceListResponse[]>(`${config.API_URL}/invoice/invoices`,
            {headers: {Authorization: `Bearer ${access_token}`}})
        ;
        console.log(response.data.data);
        return response.data.data;  // todo - should return the data (not data.data) so that can use the respnse messages in user information flashes
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getInvoiceURL = async (access_token: string, invoice_id: number) => {
    console.log(`attempting to retrieve doc url for invoice_id: ${invoice_id}`);
    if (invoice_id === 'undefined' || invoice_id === null || invoice_id === undefined || invoice_id === '') {
        return "error";
    }
    ;
    const response = await axios.get(`${config.API_URL}/invoice/${invoice_id}/file_url`,
        {headers: {Authorization: `Bearer ${access_token}`}});
    console.log(response.data.data);

    return response.data;
}

export const getInvoiceFull = async (access_token: string, invoice_id: number):InvoiceRead|null =>  {

    console.log(`attempting to retrieve doc full for invoice_id: ${invoice_id}`);
    if (invoice_id === null || invoice_id === undefined) {
        return 'error';
    }
    const response = await axios.get<InvoiceRead>(`${config.API_URL}/invoice/${invoice_id}`,
        {headers: {Authorization: `Bearer ${access_token}`}});
    console.log(response.data.data);
    return response.data;
}

export const deleteInvoice = async (access_token: string, invoice_id: number) => {
    console.log(`attempting to delete invoice_id: ${invoice_id}`);
    if (invoice_id === null || invoice_id === undefined) {
        return 'error';
    }
    const response = await axios.delete(`${config.API_URL}/invoice/${invoice_id}`,
        {headers: {Authorization: `Bearer ${access_token}`}});
    console.log(response.data);
    return response.data;
}

