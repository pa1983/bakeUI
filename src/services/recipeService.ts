import {postNewElement, fetchElement} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IRecipe} from "../models/IRecipe.ts";

const FRIENDLY_NAME = 'Recipe';
const API_ENDPOINT = 'recipe';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchRecipe(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IRecipe>> {
    return fetchElement<IRecipe>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

/**
 * Creates a new Buyable item.
 * @param formData The Buyable object to create.
 * @param access_token The user's JWT.
 */
// todo: The function is not generic. It uses the concrete `Buyable` type.  Should be useing TypeVar<T> syntax for reusability
export async function postNewRecipe(
    formData: IRecipe,
    access_token: string
): Promise<ApiResponse<IRecipe>> {
    console.log(formData);
    return postNewElement<IRecipe, 'recipe_id'>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT);
}
