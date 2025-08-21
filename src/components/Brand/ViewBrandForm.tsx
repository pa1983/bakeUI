import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {type IBrand, createEmptyBrand} from '../../models/IBrand.ts';
import {fetchBrand, postNewBrand} from "../../services/brandService.ts";
import BrandForm from './BrandForm.tsx';
import LoadingSpinner from "../Utility/LoadingSpinner.tsx";
import useFlash from "../../contexts/FlashContext.tsx";
import {patchField} from "../../services/commonService.ts";
import {useData} from "../../contexts/DataContext.tsx";

// todo - move brand form over to the factory approach for more cincise editing
interface ViewBrandFormProps {
    prop_element_id?: number | string;
    onSuccess?: (id: number) => void | null;
    isModal: boolean;  // if a form is a modal it can't use shortcuts or it'll risk affecting state of parent form
}
const api_endpoint = 'buyable/brand';  // base endpoint; will be appended with /all for full list retrieval, {id} for element, etc
const elementName = 'Brand';  // For use in messages, titles etc
const getElement = fetchBrand;  // define the function to call to get a single element
const createEmptyElement = createEmptyBrand;
const primary_key_name = 'brand_id';


const ViewBrandForm = ({prop_element_id, onSuccess, isModal=false}: ViewBrandFormProps) => {
    const {id: param_element_id} = useParams();
    const [element, setElement] = useState<IBrand | null>(null);

    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const navigate = useNavigate();

    const {refetchBrands} = useData();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<string | number | null>(null);

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
            setElement(createEmptyElement());
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


    const handleSave = async (formData: IBrand) => {
        // called only when creating a new element from scratch - not for saving changes
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error. Please log in again.", 'danger');
            return;
        }
        try {
            setIsSaving(true);
            const apiResponse = await postNewBrand(formData, auth.user.access_token);
            showFlashMessage(apiResponse.message, 'success');
            if (apiResponse.data) {
                // trigger the element list in the invoice context to repopulate
                refetchBrands();

                // todo - change this - want to replace this with a callback so that the caller can decide what should happen when a save is successful
                if (onSuccess) {
                    onSuccess(apiResponse.data[primary_key_name]);
                } else {
                    navigate(`/${api_endpoint}/${apiResponse.data[primary_key_name]}`
                    )
                }

            }
        } catch (error) {
            console.error(error);
            showFlashMessage(error instanceof Error ? error.message : 'An unknown error occurred', 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;

        let value: string | boolean | number | null;

        if (type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            const numValue = e.target.value;
            value = numValue === '' ? null : parseFloat(numValue);
        } else {
            value = e.target.value;
        }

        setElement(prevElement => {
            if (!prevElement) return null;
            return {
                ...prevElement,
                [name]: value
            };
        });
    }, []);

    const handleCancel = () => {
        navigate(`/${api_endpoint}`);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setOriginalValueOnFocus(e.target.value);
    };



    const handleDelete = async () => {
        // trigger a reload of brands arrays in the data context and redirect to list

        refetchBrands();
        navigate(`/${api_endpoint}/all`);



    }


    const handleEdit = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!element || element[primary_key_name] === 0) {
            return;
        }
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error. Please log in again.", 'danger');
            return;
        }

        const { name, type } = e.target;

        // Use the same robust parsing logic as in handleChange.
        let value: string | boolean | number | null;
        if (type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            const numValue = e.target.value;
            value = numValue === '' ? null : parseFloat(numValue);
        } else {
            value = e.target.value;
        }

        if (String(originalValueOnFocus) === String(value)) {
            console.log(`No change detected for field '${name}'. Skipping PATCH.`);
            return;
        }

        try {
            setIsSaving(true);
            // The call to patchField is now fully type-safe.
            const response = await patchField<IBrand, 'brand_id'>(
                auth.user.access_token,
                element[primary_key_name],
                name as keyof IBrand, // Assert that `name` is a key of IBrand
                value as IBrand[keyof IBrand], // Assert that the parsed value is of the correct type
                api_endpoint
            );
            showFlashMessage(response.message, 'success');
            // trigger a refresh of the brand context data to update the list view
            refetchBrands();


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
        return <div className="h2 is-danger">{error}</div>;
    }

    if (!element) {
        return <div className="h2 is-warning">{elementName} not found.</div>;
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
                    isModal={isModal}
                />
            </div>
        </div>
    );
};

export default ViewBrandForm;