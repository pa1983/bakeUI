import axios, { type AxiosError } from "axios";
import config from "./api.js";

// Factory functions for use in element creation, update, delete, get etc to keep error and response handling uniform
// and comply with DRY principles

/**
 * A generic factory for creating a new element via a POST request.
 * @param formData The data object for the new element.
 * @param access_token The user's JWT, extracted from AWS cognito user.
 * @param friendly_name A user-friendly name for the element type, used in console logs and error messages.
 * @param api_endpoint The specific API endpoint for this element type (e.g., 'buyable', 'brand').
 */
export async function postNewElement<T extends { id?: number|string }>(
    formData: T,
    access_token: string,
    friendly_name: string,
    api_endpoint: string
): Promise<ApiResponse<T>> {
    const url = `${config.API_URL}/${api_endpoint}`;

    try {
        // This console.log is now type-safe due to the generic constraint `T extends { id?: any }`
        console.log(`Creating new ${friendly_name} with initial ID: ${formData.id}`);
        const response = await axios.post<ApiResponse<T>>(url, formData, {
            headers: {Authorization: `Bearer ${access_token}`}
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;
            throw new Error(`Failed to create ${friendly_name}. Status: ${status}. Reason: ${message}`);
        }
        throw new Error(`An unexpected error occurred while creating the ${friendly_name}.`);
    }
}

/**
 * A generic factory for fetching a single element by its ID.
 */
export async function fetchElement<T>(
    element_id: number | string,
    access_token: string,
    friendly_name: string,
    api_endpoint: string
): Promise<ApiResponse<T>> {
    const url = `${config.API_URL}/${api_endpoint}/${element_id}`;
    try {
        const response = await axios.get<ApiResponse<T>>(url, {
            headers: {Authorization: `Bearer ${access_token}`}
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;
            throw new Error(`Failed to fetch ${friendly_name}. Status: ${status}. Reason: ${message}`);
        }
        throw new Error(`An unexpected error occurred while fetching the ${friendly_name}.`);
    }
}

