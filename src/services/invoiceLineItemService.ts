import axios, {type AxiosError} from "axios";
import {createEmptyLineItem, type ILineItem} from "../models/invoice.ts";
import {postNewElement} from "./factoryService.ts";

export const createNewLineItem = async (access_token: string, invoice_id: number) => {
    if (invoice_id === null || invoice_id === undefined) {
        return
    }
    try {
        const emptyLineItem = createEmptyLineItem();
        emptyLineItem.invoice_id = invoice_id;  // only field to pre-populate is the link to the parent invoice id
        const response =await  postNewElement<ILineItem, 'id'>(emptyLineItem, access_token, 'Line Item', 'invoice/lineitem');


        return response.data;
    } catch (error) {
        console.error("Error posting new lineItem in lineItemService:", error);

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            // Attempt to get the error message from the API response, otherwise use the default
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;

            throw new Error(`Failed to create new line item. Status: ${status}. Reason: ${message}`);
        }

        throw new Error("An unexpected error occurred while creating the brand.");
    }
};
