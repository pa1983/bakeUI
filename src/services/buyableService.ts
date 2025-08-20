import {postNewElement, fetchElement} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IBuyable} from "../models/IBuyable.ts";

const FRIENDLY_NAME = 'Buyable';
const API_ENDPOINT = 'buyable';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchBuyable(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IBuyable>> {
    return fetchElement<IBuyable>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

/**
 * Creates a new Buyable item.
 * @param formData The Buyable object to create.
 * @param access_token The user's JWT.
 */
export async function postNewBuyable(
    formData: IBuyable,
    access_token: string
): Promise<ApiResponse<IBuyable>> {
    return postNewElement<IBuyable, 'id'>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT, 'id');
}
