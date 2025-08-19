import type {ApiResponse} from "../models/api.ts";
import type {IRecipeSubRecipe} from "../models/IRecipeSubRecipe.ts";
import {fetchAllElements, fetchElement, postNewElement} from "./factoryService.ts";


const FRIENDLY_NAME = 'Recipe Sub Recipe Link';
const API_ENDPOINT = 'recipe_sub_recipe';

/**
 * Fetches a single Buyable item by its ID.
 * @param element_id The ID of the buyable to fetch.
 * @param access_token The user's JWT.
 */
export async function fetchRecipeSubRecipe(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IRecipeSubRecipe>> {
    return fetchElement<IRecipSubRecipe>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

export async function fetchRecipeSubRecipeAll(
    recipe_id: number,
    access_token: string
): Promise<ApiResponse<IRecipeSubRecipe[]>> {
    const full_endpoint = `${API_ENDPOINT}?recipe_id=${recipe_id}`;
    return fetchAllElements<IRecipeSubRecipe>(access_token, FRIENDLY_NAME, full_endpoint);
}


/**
 * Creates a new Buyable item.
 * @param formData The Recipe Sub Recipe object to create.
 * @param access_token The user's JWT.
 */
export async function postNewRecipeSubRecipe(
    formData: IRecipeSubRecipe,
    access_token: string
): Promise<ApiResponse<IRecipeSubRecipe>> {
    const formDataIDName = 'recipe_id';
    console.log(formData);
    return postNewElement<IRecipeSubRecipe>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT, formDataIDName);
}
