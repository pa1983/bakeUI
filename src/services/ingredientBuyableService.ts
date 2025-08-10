import {postNewElement} from "./factoryService.ts";
import type {IIngredientBuyable} from "../models/IIngredient_Buyable.ts";
import type {ApiResponse} from "../models/api.ts";
import {deleteElement} from "./commonService.ts";


const  api_endpoint = 'ingredient/link_buyable';
export async function postNewIngredientBuyableLink(
    formData: IIngredientBuyable,
    access_token: string
): Promise<ApiResponse<IIngredientBuyable>> {
    console.log('postNewIngredientBuyableLink called - formData sent: ');
    console.log(formData);
    return postNewElement<IIngredientBuyable>(formData, access_token, 'Ingredient Buyable Link', api_endpoint)
}

export async function deleteIngredientBuyableLink(
    entry_id: number,
    access_token: string
): Promise<ApiResponse<any>> {
    console.log(`attempting to delete ingredient buyable link with id: ${entry_id}`);
    const response = await deleteElement(
        access_token,
        entry_id,
        api_endpoint
    )
    console.log(response.message);
    return response;

}