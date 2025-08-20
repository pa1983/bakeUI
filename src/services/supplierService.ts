import { type ISupplier } from "../models/ISupplier.ts";
import { type ApiResponse } from "../models/api.ts";
import {postNewElement, fetchElement} from "./factoryService.ts";

const API_ENDPOINT = 'buyable/supplier';
const FRIENDLY_NAME = 'Supplier';

/**
 * Fetches a single Supplier by its ID.
 */
export const fetchSupplier = (id: number | string, token: string): Promise<ApiResponse<ISupplier>> => {
    return fetchElement<ISupplier>(id, token, FRIENDLY_NAME, API_ENDPOINT);
};

/**
 * Creates a new Supplier.
 */
export const postNewSupplier = (formData: ISupplier, token: string): Promise<ApiResponse<ISupplier>> => {
    return postNewElement<ISupplier, 'supplier_id'>(formData, token, FRIENDLY_NAME, API_ENDPOINT, 'supplier_id');
};
