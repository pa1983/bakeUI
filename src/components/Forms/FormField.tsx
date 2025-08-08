import React from 'react';
import FormFieldWithPicker from '../Picker/FormFieldWithPicker.tsx';

// Define the shape of the configuration object for a single field
export interface FieldConfig {
    name: string;
    label: string;
    component: 'input' | 'textarea' | 'select' | 'checkbox' | 'picker';  // todo - anythign else I've missed?
    type?: React.HTMLInputTypeAttribute; // e.g., 'text', 'number'
    placeholder?: string;
    required?: boolean;
    options?: { value: string | number; label: string }[]; // For <select>
    // specific to the custom picker component
    onLaunchPicker?: () => void;
    pickerArray?: { id: any; name: string }[];
}

// Define the props the factory component will need
interface FormFieldProps {
    config: FieldConfig;
    formData: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onEdit: (e: React.FocusEvent<any>) => void;
    onFocus: (e: React.FocusEvent<any>) => void;
    isSaving: boolean;
}

/**
 * Define a single form field element
 * @param config
 * @param formData
 * @param onChange
 * @param onEdit
 * @param onFocus
 * @param isSaving
 * @constructor
 */
const FormField = ({ config, formData, onChange, onEdit, onFocus, isSaving }: FormFieldProps) => {
    const { name, label, component, options, onLaunchPicker, pickerArray, ...rest } = config;
    // note: using ...rest syntax to pass through additional props to child component without explicit destructuring

    // These props are common to most of input elements
    const commonProps = {
        id: name,
        name: name,
        onChange,
        onBlur: onEdit,
        onFocus,
        disabled: isSaving,
        ...rest,
    };

    const renderInput = () => {
        switch (component) {
            case 'input':
                return <input className="input" {...commonProps} value={formData[name] || ''} />;
            case 'textarea':
                return <textarea className="textarea" {...commonProps} value={formData[name] || ''} />;
            case 'checkbox':
                return (
                    <label className="checkbox">
                        <input type="checkbox" {...commonProps} checked={!!formData[name]} />
                        {' '}{label}
                    </label>
                );
            case 'select':
                return (
                    <div className="select is-fullwidth">
                        <select {...commonProps} value={formData[name] ?? ''}>
                            <option value="" disabled>Select an option...</option>
                            {options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                );
            // Our picker is a special case that handles its own structure
            case 'picker':
                return (
                    <FormFieldWithPicker
                        label={label}
                        fieldValue={formData[name]}
                        onLaunch={onLaunchPicker!}
                        pickerArray={pickerArray!}
                    />
                );
            default:
                return null;
        }
    };

    // The picker and checkbox components manage their own labels, so we render them directly.
    if (component === 'picker' || component === 'checkbox') {
        return <div className="field">{renderInput()}</div>;
    }

    // For all other standard components, wrap them in the standard field/label/control structure.
    return (
        <div className="field">
            <label className="label" htmlFor={name}>{label}</label>
            <div className="control">
                {renderInput()}
            </div>
        </div>
    );
};

export default FormField;