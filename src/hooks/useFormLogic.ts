import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { useShortcut } from '../contexts/KeyboardShortcutContext.tsx';
import { createDefaultPickerModalConfig, type IPickerModalConfig } from '../models/picker.ts';
import { type IGenericFormProps } from '../models/IFormProps.ts'

// Define the props that custom form hook will need - same as generic props plus the name of the primary key field
interface UseFormLogicProps<T extends { id?: number | string }> extends IGenericFormProps<T> {
    primaryKeyName: keyof T;
}

/**
 * A custom hook to encapsulate common form logic including handlers for
 * inputs, edits, focus, submission, picker modals, and keyboard shortcuts.
 */
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

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setOriginalValueOnFocus(e.target.value);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        onChange(name as keyof T, value);
    }, [onChange]);

    const handleEdit = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (isNew || !auth.user?.access_token) {
            return;
        }
        const { name, type } = e.target;
        const value = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        const originalStringValue = String(originalValueOnFocus);
        if (originalStringValue === String(value)) {
            console.log(`No change detected for field '${name}'. Skipping PATCH.`);
            return;
        }

        try {
            onEdit(name as keyof T, value);
        } catch (error) {
            console.error(error);
            // showFlashMessage(...) would go here if you pass it in
        }
    }, [isNew, auth.user, originalValueOnFocus, onEdit]);

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

    // todo - should I keep this here, or make it specific to the form for more control?

    useShortcut('Enter', isNew ? handleSave : null, { ctrl: true, disabled: isModal });

    // Return everything the component's JSX needs
    return {
        isNew,
        focusInputRef,
        pickerModalConfig,
        setPickerModalConfig,
        closePickerModal,
        toggleNewItemView,
        handleFocus,
        handleChange,
        handleEdit,
        handleSubmit,
    };
};