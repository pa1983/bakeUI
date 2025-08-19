import axios, { type AxiosError } from "axios";
import config from "./api.ts";
import type { IBrand } from "../models/IBrand.ts";
import type { ApiResponse } from "../models/api.ts";

export async function postNewBrand(brand: IBrand, access_token: string): Promise<ApiResponse<IBrand>> {
    const url = `${config.API_URL}/buyable/brand`;

    try {
        console.log(`creating new brand in brandService ${brand.brand_id}`);
        const response = await axios.post<ApiResponse<IBrand>>(url, brand, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        // Return the entire ApiResponse object
        return response.data;

    } catch (error) {
        console.error("Error posting new brand in brandService:", error);

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            // Attempt to get the error message from the API response, otherwise use the default
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;

            throw new Error(`Failed to create brand. Status: ${status}. Reason: ${message}`);
        }

        throw new Error("An unexpected error occurred while creating the brand.");
    }
}

// todo - make this info a factory function - fetch element, pass in element api endpoint, make errors dynaic using type name.  api responses already dynamic.

export async function fetchBrand(brand_id: number, access_token: string): Promise<ApiResponse<IBrand>> {
    const url = `${config.API_URL}/buyable/brand/${brand_id}`;
    try {
        const response = await axios.get<ApiResponse<IBrand>>(url, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;
            const message = (axiosError.response?.data as { detail?: string })?.detail || axiosError.message;
            throw new Error(`Failed to fetch brand. Status: ${status}. Reason: ${message}`);
        }
        throw new Error("An unexpected error occurred while fetching the brand.");
    }
}

