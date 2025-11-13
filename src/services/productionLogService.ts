import type {IProductionLog} from "../models/IProductionLog.ts";
import {fetchAllElementsWithParams, postNewElement} from "./factoryService.ts";
import {type ApiResponse} from "../models/api.ts";
import {fetchElement} from "./factoryService.ts";

const FRIENDLY_NAME = 'Production';
const API_ENDPOINT = 'production';

export async function fetchProductionLog(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IProductionLog>> {
    return fetchElement<IProductionLog>(
        element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);

}
export async function fetchAllProductionLog(
    access_token: string,
    // params: string | null   // todo - consider how this should be passed in to satisfy the Record type for key-value pairs of params and values, primarily for start-end dates for filters
): Promise<ApiResponse<IProductionLog[]>> {
    return fetchAllElementsWithParams<IProductionLog>(
        access_token, FRIENDLY_NAME, API_ENDPOINT);

}

export async function postProductionLog(
    formData: IProductionLog,
    access_token: string

): Promise<ApiResponse<IProductionLog>> {
    return postNewElement(formData, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

// delete is generic, as is patch
// all???
