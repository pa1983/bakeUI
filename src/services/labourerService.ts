import type {ILabourer} from "../models/ILabourer.ts";
import {postNewElement} from "./factoryService.ts";
import {type ApiResponse} from "../models/api.ts";
import {fetchElement} from "./factoryService.ts";

const FRIENDLY_NAME = 'Labourer';
const API_ENDPOINT = 'labourer';


export async function fetchLabourer(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<ILabourer>> {
    return fetchElement<ILabourer>(
        element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

export async function postNewLabourer(
    formData: ILabourer,
    access_token: string
): Promise<ApiResponse<ILabourer>> {
    return postNewElement(formData, access_token, FRIENDLY_NAME, API_ENDPOINT, 'id');
}


