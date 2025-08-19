import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { useShortcut } from '../contexts/KeyboardShortcutContext.tsx';
import { createDefaultPickerModalConfig, type IPickerModalConfig } from '../models/picker.ts';
import { type IGenericFormProps } from '../models/IFormProps.ts';

interface UseFormLogicProps<T extends { id?: number | string }> extends IGenericFormProps<T> {
    primaryKeyName: keyof T;
}

export const useFormLogic = <T extends { id?: number | string }>({
                                                                     formData,
                                                                     onSave,
                                                                     onChange,
                                                                     onEdit,
                                                                     isSaving,
                                                                     isModal,
                                                                     primaryKeyName
                                                                 }: UseFormLogicProps<T>) => {


    const isNew = !formData?.[primaryKeyName] || formData[primaryKeyName] === 0;
    const focusInputRef = useRef<HTMLInputElement>(null);
    const auth = useAuth();
    const [originalValueOnFocus, setOriginalValueOnFocus] = useState<any>(null);
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
        const value = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        onChange(name as keyof T, value);
    }, [onChange]);

    // A dedicated handler for programmatic value changes, i.e, from a picker - named explicitly for now; can make generic if find use cases other than in picker callbacks
    const handlePickerValueChange = useCallback((name: keyof T, value: any) => {
        onChange(name, value);  // always update the parent formData attribute
        if (!isNew){
            onEdit(name, value);  // if it's not a new entry form, push the change to the API
        }
    }, [onChange]);


    const handleEdit = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        // If originalValueOnFocus is null, it means we haven't had a valid focus event
        // since the component was rendered or refreshed. Do not proceed.
        if (originalValueOnFocus === null) {
            return;
        };


        if (isNew || !auth.user?.access_token) {
            return;
        }
        const { name, type } = e.target;
        const value = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        // leaving this in for debugging in future
        // console.log(`handle edit comparing ${originalValueOnFocus} to ${value} - ${String(originalValueOnFocus) === String(value)?"true":"false"}`);

        if (String(originalValueOnFocus) === String(value)) {
            return;
        }
        onEdit(name as keyof T, value);
    }, [isNew, auth.user, originalValueOnFocus, onEdit]);



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