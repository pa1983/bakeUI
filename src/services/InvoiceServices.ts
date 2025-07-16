import axios from "axios";
import type {InvoiceListResponse} from "../models/invoice.ts";
import config from "./api.js";

// fetch invoice list and ensure it matches the InvoiceListResponse model format
export const fetchInvoices = async (access_token: string): Promise<InvoiceListResponse[]> => {
    const response = await axios.get<InvoiceListResponse[]>(`${config.API_URL}/invoice/invoices`,
        {headers: {Authorization: `Bearer ${access_token}`}})
    ;
    console.log(response.data.data);
    return response.data.data;

}

fetchInvoices(config.TOKEN);

