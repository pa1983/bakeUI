import React from 'react';
import LoadingSpinner from '../Utility/LoadingSpinner';
import { useElementFormLogic, type ElementFormConfig } from '../../hooks/useElementFormLogic';
import {type IGenericFormProps } from '../../models/IFormProps';

interface ElementViewProps<T> {
    config: ElementFormConfig<T>;
    FormComponent: React.ComponentType<IGenericFormProps<T>>;
}

export const ElementView = <T extends { [key: string]: any }>({ config, FormComponent }: ElementViewProps<T>) => {
    const {
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
    } = useElementFormLogic<T>(config);

    if (isLoading) {
        return <LoadingSpinner size='is-large' text={`Loading ${config.elementName} details...`} />;
    }

    if (error) {
        return <div className="notification is-danger">{error}</div>;
    }

    if (!element) {
        return <div className="notification is-warning">{config.elementName} not found.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="title">{formTitle}</h1>
            <div className="box">
                <FormComponent
                    formData={element}
                    onSave={handleSave}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    isSaving={isSaving}
                    onDelete={handleDelete}
                    isModal={!!config.prop_element_id} // concise way to determine if it's a modal
                />
            </div>
        </div>
    );
};