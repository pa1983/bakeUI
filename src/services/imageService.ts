import type {ApiResponse} from "../models/api.ts";
import {deleteElement, fetchAllElements} from "./factoryService.ts";
import type {IImage} from "../models/IImage.ts";

export async function fetchImages(
    url: string,
    access_token: string
): Promise<ApiResponse<IImage[]>> {
    return fetchAllElements<IImage>( access_token, "Ingredient Images", url);
}


export async function deleteImage(
    link_id: number,
    access_token: string
): Promise<ApiResponse<never>> {
    const apiEndpoint = `ingredient_image`;
    return deleteElement(link_id, access_token, "delete image", apiEndpoint);
}

