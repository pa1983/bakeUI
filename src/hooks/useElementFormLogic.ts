import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import useFlash from '../contexts/FlashContext';
import { patchField } from '../services/commonService';

// Define the shape of the configuration object the hook needs
export interface ElementFormConfig<T> {
    prop_element_id?: number | string;
    primaryKeyName: keyof T;
    elementName: string;
    apiEndpoint: string;
    createEmptyElement: () => T;
    getElement: (id: number, token: string) => Promise<{ data: T, message?: string }>;
    postNewElement: (data: T, token: string) => Promise<{ data: T, message: string }>;
    refetchDataList: () => void;
}

export const useElementFormLogic = <T extends { [key: string]: any }>(config: ElementFormConfig<T>) => {
    const {
        prop_element_id,
        primaryKeyName,
        elementName,
        apiEndpoint,
        createEmptyElement,
        getElement,
        postNewElement,
        refetchDataList,
    } = config;

    const { id: param_element_id } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const { showFlashMessage } = useFlash();

    const [element, setElement] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const isNew = param_element_id === 'new' || prop_element_id === 'new';
    const formTitle = isNew ? `Create New ${elementName}` : `Edit ${elementName}`;

    useEffect(() => {
        if (auth.isLoading) return;

        const loadElement = async (id: number) => {
            if (!auth.user?.access_token) {
                setError("You must be logged in.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await getElement(id, auth.user.access_token);
                console.log(response.data);
                setElement(response.data);
            } catch (err: any) {
                const msg = err.message || `Failed to fetch ${elementName}`;
                setError(msg);
                showFlashMessage(msg, 'danger');
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
                setError("No valid element ID provided.");
                setIsLoading(false);
            }
        }
    }, [isNew, param_element_id, prop_element_id, auth.isLoading, auth.user, getElement]);

    const handleSave = async (formData: T) => {
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error.", 'danger');
            return;
        }
        setIsSaving(true);
        try {
            const response = await postNewElement(formData, auth.user.access_token);
            showFlashMessage(response.message, 'success');
            if (response.data) {
                refetchDataList();
                navigate(`/${apiEndpoint}/${response.data[primaryKeyName]}`);
            }
        } catch (err: any) {
            showFlashMessage(err.message || 'An unknown error occurred', 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = useCallback((fieldName: keyof T, value: any) => {
        setElement(prev => (prev ? { ...prev, [fieldName]: value } : null));
    }, []);

    const handleEdit = async (fieldName: keyof T, value: any) => {
        if (isNew || !element || !auth.user?.access_token) {
            // For new elements, handleChange already updated the state. No API call needed.
            return;
        }
        setIsSaving(true);
        try {
            const response = await patchField(auth.user.access_token, element[primaryKeyName], fieldName as string, value, apiEndpoint);
            setElement(response.data);
            showFlashMessage(response.message, 'success');
        } catch (err: any) {
            showFlashMessage(err.message || 'Failed to save changes', 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => navigate(`/${apiEndpoint}/all`);
    const handleDelete = () => {
        refetchDataList();
        navigate(`/${apiEndpoint}/all`);
    };

    return {
        element,
        isLoading,
        error,
        isSaving,
        formTitle,
        handleSave,
        handleChange,
        handleEdit,
        handleCancel,
        handleDelete,
    };
};