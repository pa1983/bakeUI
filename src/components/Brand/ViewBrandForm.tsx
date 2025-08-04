import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {type Brand, createEmptyBrand} from '../../models/brand.ts';
import {fetchBrand, postNewBrand} from "../../services/brandService.ts";
import BrandForm from './BrandForm.tsx';
import LoadingSpinner from "../Utility/LoadingSpinner.tsx";
import useFlash from "../../contexts/FlashContext.tsx";
import {patchField} from "../../services/commonService.ts";

interface ViewBrandFormProps {
    prop_brand_id?: number | string;
}

const ViewBrandForm = ({prop_brand_id}: ViewBrandFormProps) => {
    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const navigate = useNavigate();
    const {brand_id: param_brand_id} = useParams();

    const [brand, setBrand] = useState<Brand | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<any>(null);

    const isNew = param_brand_id === 'new' || prop_brand_id === 'new';
    const formTitle = isNew ? "Create New Brand" : "Edit Brand";
    const api_endpoint = 'buyable/brand';


    useEffect(() => {
        // Guard against running until auth state is resolved
        if (auth.isLoading) {
            return;
        }

        const loadBrand = async (id: number) => {
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                const errorMessage = "You must be logged in to view this content.";
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetchBrand(id, auth.user.access_token);
                if (response.data) {
                    setBrand(response.data);
                } else {
                    const errorMessage = response.message || `Brand with ID ${id} not found.`;
                    setError(errorMessage);
                    showFlashMessage(errorMessage, 'danger');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : `Failed to fetch brand data for ID ${id}`;
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isNew) {
            setBrand(createEmptyBrand());
            setIsLoading(false);
        } else {
            const idToFetch = prop_brand_id ? Number(prop_brand_id) : (param_brand_id ? parseInt(param_brand_id, 10) : null);
            if (idToFetch && !isNaN(idToFetch)) {
                loadBrand(idToFetch);
            } else {
                const errorMessage = "No valid brand ID provided.";
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                setIsLoading(false);
            }
        }
    }, [isNew, param_brand_id, prop_brand_id, auth.isLoading, auth.isAuthenticated, auth.user?.access_token, showFlashMessage]);

    const handleSave = async (formData: Brand) => {
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error. Please log in again.", 'danger');
            return;
        }
        try {
            setIsSaving(true);
            const apiResponse = await postNewBrand(formData, auth.user.access_token);
            showFlashMessage(apiResponse.message, 'success');
            if (apiResponse.data) {
                navigate(`/${api_endpoint}/${apiResponse.data.brand_id}`);
            }
        } catch (error) {
            console.error(error);
            showFlashMessage(error instanceof Error ? error.message : 'An unknown error occurred', 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setBrand(prevBrand => prevBrand ? {...prevBrand, [name]: value} : null);
    }, []);

    const handleCancel = () => {
        navigate(`/${api_endpoint}`);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setOriginalValueOnFocus(e.target.value);
    };

    const handleEdit = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!brand || brand.brand_id === 0) {
            return;
        }
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error. Please log in again.", 'danger');
            return;
        }

        const { name, value } = e.target;

        if (originalValueOnFocus === value) {
            console.log(`No change detected for field '${name}'. Skipping PATCH.`);
            return;
        }

        try {
            setIsSaving(true);
            const response = await patchField(auth.user.access_token, brand.brand_id, name, value, api_endpoint);
            showFlashMessage(response.message, 'success');

            if (response.data) {
                setBrand(response.data);
            }
        } catch (error) {
            console.error(error);
            showFlashMessage(error instanceof Error ? error.message : 'An unknown error occurred - changes were not saved', 'danger');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return <LoadingSpinner size='is-large' text='Loading brand details...'/>;
    }

    if (error) {
        return <div className="notification is-danger">{error}</div>;
    }

    if (!brand) {
        return <div className="notification is-warning">Brand not found.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="title">{formTitle}</h1>
            <div className="box">
                <BrandForm
                    formData={brand}
                    onSave={handleSave}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    onFocus={handleFocus}
                    isSaving={isSaving}
                />
            </div>
        </div>
    );
};

export default ViewBrandForm;