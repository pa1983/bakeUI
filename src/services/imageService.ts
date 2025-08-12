import type {ApiResponse} from "../models/api.ts";
import type {IBuyable} from "../models/IBuyable.ts";
import {deleteElement, fetchAllElementsDumb, fetchElement} from "./factoryService.ts";
import config from '../services/api.js';

export async function fetchImages(
    url: string,
    access_token: string
): Promise<ApiResponse<Image[]>> {
    return fetchAllElementsDumb<IBuyable>( access_token, "Ingredient Images", url);
}


export async function deleteImage(
    link_id: number,
    access_token: string
): Promise<ApiResponse<any>> {
    const apiEndpoint = `ingredient_image`;
    return deleteElement(link_id, access_token, "delete image", apiEndpoint);
}

