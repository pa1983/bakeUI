import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import useFlash from '../contexts/FlashContext';
import { patchField } from '../services/commonService';
import type {IGenericFormProps} from "../models/IFormProps.ts";

// The config is generic over the entity `T` and its primary key's name `K`.
export interface ElementFormConfig<T, K extends keyof T> {
    prop_element_id?: number | string;
    primaryKeyName: K;
    elementName: string;
    apiEndpoint: string;
    createEmptyElement: () => T;
    getElement: (id: number | string, token: string) => Promise<{ data: T | null, message?: string }>;
    postNewElement: (data: T, token: string) => Promise<{ data: T | null, message: string}>;
    refetchDataList: () => void;
    FormComponent: React.ComponentType<IGenericFormProps<T>>;
    onSuccess?: (id: T[K]) => void;
    isModal?: boolean;
}

// The hook is generic over T and K
// T must be an object where the property K has a value of type number or string.
export const useElementFormLogic = <
    T extends Record<K, number | string>,
    K extends keyof T
>(config: ElementFormConfig<T, K>) => {
    const {
        prop_element_id,
        primaryKeyName,
        elementName,
        apiEndpoint,
        createEmptyElement,
        getElement,
        postNewElement,
        refetchDataList,
        onSuccess,
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
        // guard clause to prevent an attempted API call before auth is ready.
        if (auth.isLoading) return;

        const loadElement = async (id: number | string) => {
            if (!auth.user?.access_token) {
                setError("You must be logged in.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await getElement(id, auth.user.access_token);
                if (response.data) {
                    setElement(response.data);
                } else {
                    const msg = response.message || `${elementName} not found.`;
                    setError(msg);
                    showFlashMessage(msg, 'info');
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred';
                console.log(message);
                const msg = `Failed to fetch ${elementName}`;
                setError(msg);
                showFlashMessage(msg, 'danger');
            } finally {
                setIsLoading(false);
            }
        };

        if (isNew) {
            // If this is a new element, create an empty element using the definition from props,  and stop loading.
            setElement(createEmptyElement());
            setIsLoading(false);
        } else {
            // If prop_element_id is provided, use it. Otherwise, use the param_element_id.
            // If neither is provided, set an error and stop loading.
            const idToFetch = prop_element_id ?? param_element_id;
            if (idToFetch) {
                loadElement(idToFetch);
            } else {
                setError("No valid element ID provided.");
                setIsLoading(false);
            }
        }
    }, [isNew, param_element_id, prop_element_id, auth.isLoading, auth.user, getElement]);
    // default handleSave behaviour - make an API call to post the new element
    // with the form data.  Only ever used for a NEW element - not for editing. Editing is handled by handleEdit
    // and patches changes field-by-field, as they're made for a better user experience.
    const handleSave = async (formData: T|null) => {
        if(!formData){
            return;
        }
        if (!auth.user?.access_token) {
            showFlashMessage("Authentication error.", 'danger');
            return;
        }
        setIsSaving(true);
        try {
            const response = await postNewElement(formData, auth.user.access_token);

            // previously had status_code from api response (incorrectly) and was conditionally setting the flash type
            // from this.  Now relying on exception being thrown by errors and handled in the postNewElement function. todo - TEST
            const flashType =  'success';

            showFlashMessage(response.message, flashType);

            if (flashType === 'success' && response.data) {
                refetchDataList();
                if (onSuccess) {
                    // The type of response.data[primaryKeyName] is now correctly inferred as T[K].
                    onSuccess(response.data[primaryKeyName]);
                } else {
                    navigate(`/${apiEndpoint}/${response.data[primaryKeyName]}`);
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            console.log(message);
            showFlashMessage( 'An error occurred', 'danger');
        } finally {
            // set the state to false after the save operation is complete.
            setIsSaving(false);
        }
    };
    // default handleChange behaviour - just update the state with the new value.
    // This is essential in react forms- without it the form will not let the user edit the content of the input
    // since the input value is tied to the value held in state.
    const handleChange = useCallback((fieldName: keyof T, value: T[keyof T]) => {
        setElement(prev => (prev ? { ...prev, [fieldName]: value } : null));
    }, []);

    // default handleEdit behaviour - make an API call to patch the edited field
    // with the new value.
    const handleEdit = useCallback(async (fieldName: keyof T, value: T[keyof T]) => {
        if (isNew || !element || !auth.user?.access_token) {
            return;
        }

        setIsSaving(true);
        try {
            // patch field accepts the Type and Key of the element being edited, with parameters for
            // the auth access token, the primary key name of the element, the field name, the new value, and the api endpoint.
            const response = await patchField<T, K>(
                auth.user.access_token,
                element[primaryKeyName],
                fieldName,
                value,
                apiEndpoint
            );

            if (response.data) {
                setElement(response.data);
            }
            showFlashMessage(response.message, 'success');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            console.log(message);
            showFlashMessage('Failed to save changes', 'danger');
        } finally {
            setIsSaving(false);
        }
    }, [isNew, element, auth.user, primaryKeyName, apiEndpoint, showFlashMessage]);

    // default cancel callback behaviour - just go back to the list view
    const handleCancel = () => navigate(`/${apiEndpoint}/all`);
    //default delete callback behaviour - just go back to the list view
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