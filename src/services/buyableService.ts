import {postNewElement, fetchElement} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {Buyable} from "../models/buyable.ts";
import {deleteElement} from "./commonService.ts";


const BUYABLE_FRIENDLY_NAME = 'Buyable';
const BUYABLE_API_ENDPOINT = 'buyable';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchBuyable(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<Buyable>> {
    return fetchElement<Buyable>(element_id, access_token, BUYABLE_FRIENDLY_NAME, BUYABLE_API_ENDPOINT);
}

/**
 * Creates a new Buyable item.
 * @param formData The Buyable object to create.
 * @param access_token The user's JWT.
 */
// FIX: The function is not generic. It uses the concrete `Buyable` type.
export async function postNewBuyable(
    formData: Buyable,
    access_token: string
): Promise<ApiResponse<Buyable>> {
    return postNewElement<Buyable>(formData, access_token, BUYABLE_FRIENDLY_NAME, BUYABLE_API_ENDPOINT);
}
