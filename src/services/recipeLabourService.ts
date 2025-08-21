import {postNewElement, fetchElement, fetchAllElements} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IRecipeLabour} from "../models/IRecipeLabour.ts";

const FRIENDLY_NAME = 'Recipe Labour Link';
const API_ENDPOINT = 'recipe_labour';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchRecipeLabour(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IRecipeLabour>> {
    return fetchElement<IRecipeLabour>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

export async function fetchRecipeLabourAll(
    recipe_id: number,
    access_token: string
): Promise<ApiResponse<IRecipeLabour[]>> {
    const full_endpoint = `${API_ENDPOINT}?recipe_id=${recipe_id}`;
    return fetchAllElements<IRecipeLabour>(access_token, FRIENDLY_NAME, full_endpoint);
}


/**
 * Creates a new Buyable item.
 * @param formData The Buyable object to create.
 * @param access_token The user's JWT.
 */
// todo: The function is not generic. It uses the concrete `Buyable` type.  Should be useing TypeVar<T> syntax for reusability
export async function postNewRecipeLabour(
    formData: IRecipeLabour,
    access_token: string
): Promise<ApiResponse<IRecipeLabour>> {
    console.log(formData);
    return postNewElement<IRecipeLabour, 'id'>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT);
}
