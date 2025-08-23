import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { useShortcut } from '../contexts/KeyboardShortcutContext.tsx';
import { createDefaultPickerModalConfig, type IPickerModalConfig } from '../models/picker.ts';
import { type IGenericFormProps } from '../models/IFormProps.ts';

interface UseFormLogicProps<T, K extends keyof T> extends IGenericFormProps<T> {
    primaryKeyName: K;
}


export const useFormLogic = <
    T extends Record<K, number | string | undefined | null>,
    K extends keyof T
>({
                                                                     formData,
                                                                     onSave,
                                                                     onChange,
                                                                     onEdit,
                                                                     isSaving,
                                                                     isModal,
                                                                     primaryKeyName
                                                                 }: UseFormLogicProps<T,K>) => {


    const isNew = !formData?.[primaryKeyName] || formData[primaryKeyName] === 0;
    const focusInputRef = useRef<HTMLInputElement>(null);
    const auth = useAuth();
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<unknown>(null);
    const [pickerModalConfig, setPickerModalConfig] = useState<IPickerModalConfig>(createDefaultPickerModalConfig());

    // ADDED to fix issue with PATCH being fired by onEdit for every element in recipeElement viewer on reload
    // This effect runs when the component first mounts and whenever the entity
    // it represents changes (identified by its primary key) and invalidates the focus state after a list refresh.
    useEffect(() => {
        setOriginalValueOnFocus(null);
    }, [formData[primaryKeyName]]);


    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // console.log(`handleFocus fired, value: ${e.target.value}`);
        const fieldName = e.target.name as keyof T;
        const valueOnFocus = formData[fieldName];
        console.log(`handleFocus fired for field: '${String(fieldName)}'. Value is:`, valueOnFocus);
        setOriginalValueOnFocus(formData[fieldName]);
    }, [formData]);

    // This handler is for standard DOM change events
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;

        let value: string | boolean | number | null;

        if (type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            // Handle number inputs, treating empty strings as null.
            const numValue = e.target.value;
            value = numValue === '' ? null : parseFloat(numValue);
        } else {
            value = e.target.value;
        }

        onChange(name as keyof T, value as T[keyof T]);
    }, [onChange]);

    const handlePickerValueChange = useCallback(<FieldName extends keyof T>(name: FieldName, value: T[FieldName]) => {
        onChange(name, value);
        const originalValue = formData?.[name];
        if (originalValue !== value) {
            onEdit(name, value, originalValue as T[FieldName]);
        }
    }, [onChange, onEdit, isNew]);


    const handleEdit = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        // default behaviour should be to send a patch request for the endpoint with the key-value pair
        if (originalValueOnFocus === null) {
            console.log('stopping-original value passed in was null');
            return;
        }
        if (isNew || !auth.user?.access_token) {
            console.log('stopping- user not logged in');
            return;
        }

        const { name, type } = e.target;
        console.log(`generic handleEdit fired for name: ${name}, type: ${type}`);
        // Use the same parsing logic as in handleChange to get the correct new value type.
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
            console.log("No change detected - stopping");
            return;
        }

        // Retrieve the original value with its correct type from the formData prop.
        const originalTypedValue = originalValueOnFocus as T[keyof T];

        // Call onEdit with all three required arguments.
        console.log(`calling onEdit with name: ${name}, value: ${value}, originalTypedValue: ${originalTypedValue}`);
        onEdit(name as keyof T, value as T[keyof T], originalTypedValue as T[keyof T]);  // todo - fix this value and originaltypedvalue are boththe same?

    }, [isNew, auth.user, originalValueOnFocus, onEdit, formData]); //

    const closePickerModal = useCallback(() => {
        setPickerModalConfig(createDefaultPickerModalConfig());
    }, []);

    const toggleNewItemView = useCallback(() => {
        setPickerModalConfig(prev => ({ ...prev, addNewFormActive: !prev.addNewFormActive }));
    }, []);

    const handleSave = useCallback(() => {
        onSave(formData);
    }, [formData, onSave]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    }, [handleSave]);

    useEffect(() => {
        focusInputRef.current?.focus();
    }, []);

        // only assign save shortcut if is new and not in modal view
    useShortcut('Enter', (isNew && !isModal) ? handleSave : null);

    return {
        isNew,
        focusInputRef,
        pickerModalConfig,
        setPickerModalConfig,
        closePickerModal,
        toggleNewItemView,
        handleFocus,
        handleChange, // For standard inputs
        handleValueChange: handlePickerValueChange, // For pickers and other custom components
        handleEdit,
        handleSubmit,
        isSaving
    };
};