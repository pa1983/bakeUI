import axios from "axios";
import config from "./api.ts";
import type {ApiResponse} from "../models/api.ts";

// Factory functions for use in element creation, update, delete, get etc to keep error and response handling uniform
// and comply with DRY principles

function handleAxiosError(error: unknown, action: string, friendly_name: string): never {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = (error.response?.data as { detail?: string })?.detail || error.message;
        throw new Error(`Failed to ${action} ${friendly_name}. Status: ${status}. Reason: ${message}`);
    }
    throw new Error(`An unexpected error occurred while ${action}ing the ${friendly_name}.`);
}


/**
 * A generic factory for creating a new element via a POST request.
 * @param formData The data object for the new element.
 * @param access_token The user's JWT, extracted from AWS cognito user.
 * @param friendly_name A user-friendly name for the element type, used in console logs and error messages.
 * @param api_endpoint The specific API endpoint for this element type (e.g., 'buyable', 'brand').
 * @param formDataIDName  The name of the ID field in formdata - usually 'id' so this is defaulted in
 */
export async function postNewElement<T, K extends keyof T>(
    formData: T,
    access_token: string,
    friendly_name: string,
    api_endpoint: string,
    formDataIDName: K
): Promise<ApiResponse<T>> {
    const url = `${config.API_URL}/${api_endpoint}`;

    try {
        // This console.log is now type-safe due to the generic constraint `T extends { id?: any }`
        console.log(`Creating new ${friendly_name} with initial ID: ${formData[formDataIDName]}`);
        const response = await axios.post<ApiResponse<T>>(url, formData, {
            headers: {Authorization: `Bearer ${access_token}`}
        });
        console.log(response.data);
        return response.data;

    } catch (error) {
        handleAxiosError(error, 'create', friendly_name);
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

    console.log(`fetching from url ${url} with element ID ${element_id}, friendly name ${friendly_name}, api endpoint ${api_endpoint}. Response.data: `);

    try {
        const response = await axios.get<ApiResponse<T>>(url, {
            headers: {Authorization: `Bearer ${access_token}`}
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'fetch', friendly_name);
    }
}


/** Factory function to delete an element by ID
 *
 * @param element_id
 * @param access_token
 * @param friendly_name
 * @param api_endpoint
 */
export async function deleteElement<T>(
    element_id: number | string,
    access_token: string,
    friendly_name: string,
    api_endpoint: string  // just the endpoint - function will build full url from API URL in config and element ID passed in
): Promise<ApiResponse<T>> {
    const url = `${config.API_URL}/${api_endpoint}/${element_id}`;

    console.log(`DELETE sent to url ${url} with element ID ${element_id}, friendly name ${friendly_name}, api endpoint ${api_endpoint}. Response.data: `);

    try {
        const response = await axios.delete<ApiResponse<T>>(url, {
            headers: {Authorization: `Bearer ${access_token}`}
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'delete', friendly_name);
    }
}

/**
 * For edge cases, function takes any url and passes it to the api, and passes back whatever it gets
 * @param access_token
 * @param friendly_name
 * @param api_endpoint
 */
export async function fetchAllElements<T>(
    access_token: string,   // jwt taken from auth.user.access_token
    friendly_name: string,  // for display in console and log messages
    api_endpoint: string  // note - no leading or trailing slashes
): Promise<ApiResponse<T[]>> {
    const url = `${config.API_URL}/${api_endpoint}`;

    console.log(`fetching from url ${url} , friendly name ${friendly_name}, api endpoint ${api_endpoint}.`);

    try {
        const response = await axios.get<ApiResponse<T[]>>(url, {
            headers: {Authorization: `Bearer ${access_token}`}
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'fetch all', friendly_name);
    }
}
