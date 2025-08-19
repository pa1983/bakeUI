// take response containing hetergeneous list of recipe elements from api and populate RecipeElement list for
// display in the recipe component.


import {fetchAllElements} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IRecipeElement} from "../models/IRecipeElement.ts";

const FRIENDLY_NAME = "Recipe Elements";


export async function fetchRecipeElements(
    access_token: string,
    recipe_id: number | string
): Promise<ApiResponse<IRecipeElement[]>> {
    const API_ENDPOINT = `/recipe/${recipe_id}/elements}`;
    console.log(`gettingRecipe elements from ${API_ENDPOINT}`);
    return fetchAllElements(access_token, FRIENDLY_NAME, API_ENDPOINT);
}