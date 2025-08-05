import config from "./api";
import axios, {type AxiosError} from "axios";
import type {ApiResponse} from "../models/api";

// generic field patching function for use by all forms that save changes as they're made
export const patchField = async <T>(
    access_token: string,
    entry_id: number | string,
    field_name: string,
    field_value: any,
    api_endpoint: string
): Promise<ApiResponse<T>> => {
    if (entry_id === null || entry_id === undefined) {
        // Throw a clear error for invalid input, which can be caught by the caller.
        throw new Error("Invalid entry_id provided to patchField service.");
    }

    const api_url = `${config.API_URL}/${api_endpoint}/${entry_id}`;
    console.log(`Attempting to patch ${api_url} for entry_id: ${entry_id} with field: ${field_name} and value: ${field_value}`);

    try {
        const response = await axios.patch<ApiResponse<T>>(
            api_url,
            // {
            //         "field_name": field_name,
            //     "new_value": field_value
            // },

            {
                [field_name]: field_value
            },
            // todo - fix invoice patch api to match this structure

            {headers: {Authorization: `Bearer ${access_token}`}}
        );
        return response.data;  // returns the full api response object

    } catch (error) {
        console.error(`Error patching field '${field_name}' for entry_id ${entry_id}:`, error);

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