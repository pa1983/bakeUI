import {postNewElement, fetchElement} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IBuyable} from "../models/IBuyable.ts";

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
): Promise<ApiResponse<IBuyable>> {
    return fetchElement<IBuyable>(element_id, access_token, BUYABLE_FRIENDLY_NAME, BUYABLE_API_ENDPOINT);
}

/**
 * Creates a new Buyable item.
 * @param formData The Buyable object to create.
 * @param access_token The user's JWT.
 */
// todo: The function is not generic. It uses the concrete `Buyable` type.  Should be useing TypeVar<T> syntax for reusability
export async function postNewBuyable(
    formData: IBuyable,
    access_token: string
): Promise<ApiResponse<IBuyable>> {
    return postNewElement<IBuyable>(formData, access_token, BUYABLE_FRIENDLY_NAME, BUYABLE_API_ENDPOINT);
}
