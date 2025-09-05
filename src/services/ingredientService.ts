import {postNewElement, fetchElement} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {IIngredient} from "../models/IIngredient.ts";

const FRIENDLY_NAME = 'Ingredient';
const API_ENDPOINT = 'ingredient';

export async function fetchIngredient(
    element_id: number | string,
    access_token: string
): Promise<ApiResponse<IIngredient>> {
    return fetchElement<IIngredient>(element_id, access_token, FRIENDLY_NAME, API_ENDPOINT);
}

// todo: The function is not generic. It uses the concrete `Buyable` type.  Should be useing TypeVar<T> syntax for reusability
export async function postNewIngredient(
    formData: IIngredient,
    access_token: string
): Promise<ApiResponse<IIngredient>> {
    return postNewElement<IIngredient, 'ingredient_id'>(formData, access_token, FRIENDLY_NAME, API_ENDPOINT);
}
