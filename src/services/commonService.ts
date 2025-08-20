import config from "./api";
import axios, {type AxiosError} from "axios";
import type {ApiResponse} from "../models/api";

// generic field patching function for use by all forms that save changes as they're made
/**
 * <T, K> where T is the object type, e.g. IIngredient, and K is the name of the primary key of T (e.g. ingredient_id)
 * @param access_token
 * @param entry_id
 * @param field_name
 * @param field_value
 * @param api_endpoint
 */
export const patchField = async <
    // T is the object type (e.g., Ingredient)
    T,
    // K is the name of the primary key (e.g., 'id', 'ingredient_id')
    K extends keyof T
>(
    access_token: string,
    // The ID's value must match the type of the primary key on the object
    entry_id: T[K],
    // The field name must be a valid key of T
    field_name: keyof T,
    // The field value must match the type of that key on T
    field_value: T[keyof T],
    api_endpoint: string
): Promise<ApiResponse<T>> => {
    if (entry_id === null || entry_id === undefined) {
        throw new Error("Invalid entry_id provided to patchField service.");
    }

    const api_url = `${config.API_URL}/${api_endpoint}/${entry_id}`;
    console.log(`Attempting to patch ${api_url} with field: ${String(field_name)} and value: ${field_value}`);

    try {
        const response = await axios.patch<ApiResponse<T>>(
            api_url,
            // This computed property name is the correct, modern way to build the payload
            { [field_name as string]: field_value },
            {headers: {Authorization: `Bearer ${access_token}`}}
        );
        return response.data;

    } catch (error) {
        console.error(`Error patching field '${String(field_name)}' for entry_id ${entry_id}:`, error);

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;
            throw new Error(`Failed to update field. Status: ${status}. Reason: ${message}`);
        }

        throw new Error("An unexpected error occurred while updating the field.");
    }
};


export const deleteElement = async <T>(
        access_token: string,
        entry_id: number | string,
        api_endpoint: string
    ): Promise<ApiResponse<T>> => {
        if (entry_id === null || entry_id === undefined) {
            throw new Error("Invalid entry_id provided to deleteElement service.");
        }
        const api_url = `${config.API_URL}/${api_endpoint}/${entry_id}`;

        try {
            const response = await axios.delete<ApiResponse<T>>(
                api_url,
                {headers: {Authorization: `Bearer ${access_token}`}}
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting element with id ${entry_id}:`, error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const status = axiosError.response?.status;
                const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;
                throw new Error(`Failed to update field. Status: ${status}. Reason: ${message}`);
            }

            throw new Error("An unexpected error occurred while updating the field.");
        }

    }

;