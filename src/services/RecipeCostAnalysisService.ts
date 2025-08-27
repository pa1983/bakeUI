import {fetchAllElementsWithParams} from "./factoryService.ts";
import type {ApiResponse} from "../models/api.ts";
import type {RecipeCostAnalysis} from "../models/IRecipeCostAnalysis.ts";

const FRIENDLY_NAME = 'Recipe Cost Analysis';


export async function getRecipeCostAnalysisData(
    access_token: string, recipe_id: number, date_point: string // in format YYYY-MM-DD
): Promise<ApiResponse<RecipeCostAnalysis[]>> {
    const url: string = `recipe/${recipe_id}`;
    const params = {
        'date_point': date_point
    }
    return fetchAllElementsWithParams(access_token, FRIENDLY_NAME, url, params)
}