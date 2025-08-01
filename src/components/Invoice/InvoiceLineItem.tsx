import React, { useState, useEffect } from 'react';
import useFlash from '../../contexts/FlashContext.tsx'; // Assuming this is your flash message hook
// import { updateInvoiceLineItemField } from '../services/InvoiceServices'; // You would have a service for this
// import { useAuth } from 'react-oidc-context';

// Define the component props based on your interface
interface InvoiceLineItemProps {
    item: any; // Ideally, replace 'any' with your LineItemRead interface
}

function InvoiceLineItem({ item }: InvoiceLineItemProps) {
    const [formData, setFormData] = useState(item);
    const [isSaving, setIsSaving] = useState(false);
    const { showFlashMessage } = useFlash();
    // const auth = useAuth();

    // Reset form state if the parent passes a new item
    useEffect(() => {
        setFormData(item);
    }, [item]);

    // Handles live typing in the form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        // Handle checkboxes differently from other inputs
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    // Handle saving when a field loses focus
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const originalValue = item[name];
        const currentValue = type === 'checkbox' ? checked : value;

        // Check if the value has actually changed
        if (originalValue === currentValue) {
            return; // No change, no need to save
        }

        setIsSaving(true);
        try {
            // Simulate an API call to update the specific field
            // await updateInvoiceLineItemField(auth.user.access_token, item.id, { [name]: currentValue });
            await new Promise(resolve => setTimeout(resolve, 500));

            showFlashMessage(`Line item ${name.replace(/_/g, ' ')} updated.`, 'success');

        } catch (error) {
            console.error("Failed to update line item field:", error);
            showFlashMessage(`Error saving line item.`, 'danger');
            setFormData(item); // Revert on error
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <li className="box mb-3">
            <fieldset disabled={isSaving}>
                <div className="columns is-multiline is-vcentered is-mobile">
                    {/* --- Row 1: Core Description and Financials --- */}
                    <div className="column is-full-mobile is-half-tablet">
                        <div className="field">
                            <label className="label is-small">Description</label>
                            <div className="control">
                                <input className="input is-small" type="text" name="description" value={formData.description || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-full-mobile is-one-quarter-tablet">
                        <div className="field">
                            <label className="label is-small">Value (Ex. VAT)</label>
                            <div className="control">
                                <input className="input is-small" type="number" step="0.01" name="value_ex_vat" value={formData.value_ex_vat || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-full-mobile is-one-quarter-tablet">
                        <div className="field">
                            <label className="label is-small">Value (Inc. VAT)</label>
                            <div className="control">
                                <input className="input is-small" type="number" step="0.01" name="value_inc_vat" value={formData.value_inc_vat || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>

                    {/* --- Row 2: Quantities and Codes --- */}
                    <div className="column is-2-tablet">
                        <div className="field">
                            <label className="label is-small">Cases</label>
                            <div className="control">
                                <input className="input is-small" type="number" name="cases" value={formData.cases || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-2-tablet">
                        <div className="field">
                            <label className="label is-small">Units</label>
                            <div className="control">
                                <input className="input is-small" type="number" name="units" value={formData.units || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-2-tablet">
                        <div className="field">
                            <label className="label is-small">Size</label>
                            <div className="control">
                                <input className="input is-small" type="text" name="size" value={formData.size || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-3-tablet">
                        <div className="field">
                            <label className="label is-small">Product Code</label>
                            <div className="control">
                                <input className="input is-small" type="text" name="code" value={formData.code || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-3-tablet">
                        <div className="field">
                            <label className="label is-small">VAT %</label>
                            <div className="control">
                                <input className="input is-small" type="number" step="0.01" name="vat_percentage" value={formData.vat_percentage || ''} onChange={handleChange} onBlur={handleBlur} />
                            </div>
                        </div>
                    </div>

                    {/* --- Row 3: Meta and Flags --- */}
                    <div className="column is-narrow">
                        <div className="field">
                            <div className="control">
                                <label className="checkbox">
                                    <input type="checkbox" name="is_delivery" checked={formData.is_delivery || false} onChange={handleChange} onBlur={handleBlur} />
                                    <span className="ml-2">Is Delivery Charge</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="column has-text-right-tablet">
                        <p className="is-size-7 has-text-grey">Line ID: {item.id}</p>
                    </div>
                </div>
            </fieldset>
        </li>
    );
}

export default InvoiceLineItem;
