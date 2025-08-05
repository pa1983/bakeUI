import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {type Brand, createEmptyBrand} from '../../models/brand.ts';
import {fetchBrand, postNewElement} from "../../services/brandService.ts";
import BrandForm from './BrandForm.tsx';
import LoadingSpinner from "../Utility/LoadingSpinner.tsx";
import useFlash from "../../contexts/FlashContext.tsx";
import {patchField} from "../../services/commonService.ts";
import {useInvoice} from "../../contexts/InvoiceContext.tsx";


interface ViewElementFormProps {
    prop_element_id?: number | string;
}
const api_endpoint = 'buyable/brand';  // base endpoint; will be appended with /all for full list retrieval, {id} for element, etc
const elementName = 'Brand';  // For use in messages, titles etc
const getElement = fetchBrand;  // define the function to call to get a single element


const ViewBrandForm = ({prop_element_id}: ViewElementFormProps) => {
    // to be populated
    const {id: param_element_id} = useParams();
    const [element, setElement] = useState<Brand | null>(null);

    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const navigate = useNavigate();

    const {refetchInvoiceFormData} = useInvoice();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<any>(null);

    const isNew = param_element_id === 'new' || prop_element_id === 'new';
    const formTitle = isNew ? `Create New ${elementName}` : `Edit ${elementName}`;



    useEffect(() => {
        // Guard against running until auth state is resolved
        if (auth.isLoading) {
            return;
        }

        const loadElement = async (id: number) => {
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                const errorMessage = "You must be logged in to view this content.";
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                setIsLoading(false);
                return;
            }
            try {
                const response = await getElement(id, auth.user.access_token);
                if (response.data) {
                    setElement(response.data);
                } else {
                    const errorMessage = response.message || `${elementName} with ID ${id} not found.`;
                    setError(errorMessage);
                    showFlashMessage(errorMessage, 'danger');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${elementName} data for ID ${id}`;
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isNew) {
            setElement(createEmptyBrand());
            setIsLoading(false);
        } else {
            const idToFetch = prop_element_id ? Number(prop_element_id) : (param_element_id ? parseInt(param_element_id, 10) : null);
            if (idToFetch && !isNaN(idToFetch)) {
                loadElement(idToFetch);
            } else {
                const errorMessage = "No valid element ID provided.";
                setError(errorMessage);
                showFlashMessage(errorMessage, 'danger');
                setIsLoading(false);
            }
        }
    }, [isNew, param_element_id, prop_element_id, auth.isLoading, auth.isAuthenticated, auth.user?.access_token]);
    // note showFlashMessage - was removed from dependancy array as it was creating a race condition,
    // triggering a pull of the old id when the deletion was being confirmed, before the invoices array was updated


    const handleSave = async (formData: Brand) => {
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error. Please log in again.", 'danger');
            return;
        }
        try {
            setIsSaving(true);
            const apiResponse = await postNewElement(formData, auth.user.access_token);
            showFlashMessage(apiResponse.message, 'success');
            if (apiResponse.data) {
                // trigger the element list in the invoice context to repopulate
                refetchInvoiceFormData();
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
        setElement(prevElement => prevElement ? {...prevElement, [name]: value} : null);
    }, []);

    const handleCancel = () => {
        navigate(`/${api_endpoint}`);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setOriginalValueOnFocus(e.target.value);
    };



    const handleDelete = async () => {
        // trigger a reload of data arrays in the invoice context and redirect to list

        refetchInvoiceFormData();
        navigate(`${api_endpoint}/all`);



    }


    const handleEdit = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!element || element.brand_id === 0) {
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
            const response = await patchField(auth.user.access_token, element.brand_id, name, value, api_endpoint);
            showFlashMessage(response.message, 'success');

            if (response.data) {
                setElement(response.data);
            }
        } catch (error) {
            console.error(error);
            showFlashMessage(error instanceof Error ? error.message : 'An unknown error occurred - changes were not saved', 'danger');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return <LoadingSpinner size='is-large' text={`Loading ${elementName} details...`}/>;
    }

    if (error) {
        return <div className="notification is-danger">{error}</div>;
    }

    if (!element) {
        return <div className="notification is-warning">{elementName} not found.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="title">{formTitle}</h1>
            <div className="box">
                <BrandForm
                    formData={element}
                    onSave={handleSave}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    onFocus={handleFocus}
                    isSaving={isSaving}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ViewBrandForm;