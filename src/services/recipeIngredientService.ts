import {postNewElement, fetchElement, fetchAllElements} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IRecipeIngredient} from "../models/IRecipeIngredient.ts";

const FRIENDLY_NAME = 'Recipe Ingredient Link';
const API_ENDPOINT = 'recipe_ingredient';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchRecipeIngredient(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IRecipeIngredient>> {
    return fetchElement<IRecipeIngredient>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

export async function fetchRecipeIngredientAll(
    recipe_id: number,
    access_token: string
): Promise<ApiResponse<IRecipeIngredient[]>> {
    const full_endpoint = `${API_ENDPOINT}?recipe_id=${recipe_id}`;
    return fetchAllElements<IRecipeIngredient>( access_token, FRIENDLY_NAME, full_endpoint);
}


/**
 * Creates a new Buyable item.
 * @param formData The Recipe_Ingredient object to create.
 * @param access_token The user's JWT.
 */
export async function postNewRecipeIngredient(
    formData: IRecipeIngredient,
    access_token: string
): Promise<ApiResponse<IRecipeIngredient>> {
    return postNewElement<IRecipeIngredient, 'id'>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT);
}
