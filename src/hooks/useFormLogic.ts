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
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<string | null>(null);
    const [pickerModalConfig, setPickerModalConfig] = useState<IPickerModalConfig>(createDefaultPickerModalConfig());

    // ADDED to fix issue with PATCH being fired by onEdit for every element in recipeElement viewer on reload
    // This effect runs when the component first mounts and whenever the entity
    // it represents changes (identified by its primary key) and invalidates the focus state after a list refresh.
    useEffect(() => {
        setOriginalValueOnFocus(null);
    }, [formData[primaryKeyName]]);


    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setOriginalValueOnFocus(e.target.value);
    }, []);

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

        // The type assertion is now much safer because we've handled the common types.
        // This allows us to keep the strong `T[keyof T]` signature on the `onChange` prop.
        onChange(name as keyof T, value as T[keyof T]);
    }, [onChange]);

    // SUGGESTION: Make this handler fully generic and type-safe. This eliminates the `any`
    // and ensures that programmatic changes are just as safe as user input.
    const handlePickerValueChange = useCallback(<FieldName extends keyof T>(name: FieldName, value: T[FieldName]) => {
        onChange(name, value);
        const originalValue = formData?.[name];
        // SUGGESTION: Add a check to prevent API calls if the value hasn't changed.
        if (originalValue !== value) {
            onEdit(name, value, originalValue as T[FieldName]);
        }
    }, [onChange, onEdit, isNew]);


    const handleEdit = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (originalValueOnFocus === null) {
            return;
        }
        if (isNew || !auth.user?.access_token) {
            return;
        }

        const { name, type } = e.target;

        // Use the same robust parsing logic as in handleChange to get the correct new value type.
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
            return;
        }

        // Retrieve the original value with its correct type from the formData prop.
        const originalTypedValue = formData?.[name as keyof T];

        // Call onEdit with all three required arguments.
        onEdit(name as keyof T, value as T[keyof T], originalTypedValue as T[keyof T]);

    }, [isNew, auth.user, originalValueOnFocus, onEdit, formData]); //



    // ... (other handlers like closePickerModal, handleSubmit, etc. remain the same) ...
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

    useShortcut('Enter', isNew ? handleSave : null, { ctrl: true, disabled: isModal });

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