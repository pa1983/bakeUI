// display form containing all the invoice's meta data
import React, {useState, useEffect, useCallback} from 'react';
import useFlash from '../../contexts/FlashContext.tsx';
import {patchField} from '../../services/commonService.ts';
import {useAuth} from 'react-oidc-context';
import {useData} from "../../contexts/DataContext.tsx";
import PickerModal from "../Picker/PickerModal.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import {type IPickerElement} from "../../models/picker.ts";
import type {InvoiceRead} from "../../models/invoice.ts";


// display the form containing all the invoice's meta data - use generic name for initialFormDetails so can reuse code snippets in other forms without refactoring
function InvoiceMeta({initialFormDetails}: { initialFormDetails: InvoiceRead }) {


    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const [formData, setFormData] = useState(initialFormDetails);
    const [isSaving, setIsSaving] = useState(false); // State to disable form during save
    const api_endpoint = `invoice`;
    // picker controls
    const [isPickerModalActive, setIsPickerModalActive] = useState<boolean>(false);
    const [pickerArray, setPickerArray] = useState<[] | IPickerElement[]>([]);  // array to be passed to picker to make selections from
    const [pickerTitle, setPickerTitle] = useState<string>('');  // text descriptor for the picker popup

    // same function for picker close can be used by all possible instances of picker being called - other fields do need to change
    const handlePickerClose = useCallback(() => {
        setIsPickerModalActive(false);
    }, []);

    // get context data for use in form and pickers
    const {currencies, PickerSupplierArray} = useData();

    // now map the currency and Supplier arrays into correct shape for picker.
    // Memoize the calc'd array to avoid recalculation on every render of InvoiceMeta.
    // Make depandent on currencies - only re-create the array if currencies changes
    // use this format for all other utilisations of Picker component

    const handlePatchField = useCallback(async <K extends keyof InvoiceRead & string>(
        name: K,
        value: InvoiceRead[K],
    ) => {
        try {
            if (!auth.user) {
                showFlashMessage("You must log in to proceed", "danger");
                return;
            }

            const res = await patchField<InvoiceRead, 'id' >(
                auth.user.access_token,
                initialFormDetails.id,
                name,
                value,
                api_endpoint
            );
            showFlashMessage(res.message, 'success');

        } catch (error) {
            console.error("Failed to update field:", error);
            showFlashMessage(`Error saving ${name}. Please try again.`, 'danger');
        } finally {
            setIsSaving(false);
        }
    }, [auth.user, initialFormDetails.id, showFlashMessage, api_endpoint]);

    const updateSupplier = (newSupplierValue: number) => {
        setFormData((prevState) => ({...prevState, supplier_id: newSupplierValue}));
    }

    const supplierPickerOnSelect = useCallback(async (newSupplierId: number): Promise<void> => {
        updateSupplier(newSupplierId);

        await handlePatchField('supplier_id', newSupplierId);

        setIsPickerModalActive(false);
    }, [handlePatchField]);


    const [pickerOnSelect, setPickerOnSelect] = useState<(id: string | number) => void>(() => () => {});

    const handleSupplierPickerClick = useCallback(() => {
        console.log("Supplier picker clicked");
        setPickerTitle("Supplier");
        setPickerArray(PickerSupplierArray);
        setIsPickerModalActive(true);

        const onSelectAdapter = (id: string | number) => {
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                void supplierPickerOnSelect(numericId);   // void - don't want to do anything with the response
            } else {
                console.error("Picker returned a non-numeric ID for supplier:", id);
            }
        };
        // Store the actual handler function in state.
        setPickerOnSelect(() => onSelectAdapter);
    }, [PickerSupplierArray, supplierPickerOnSelect]);


    // Reset form state if a new invoice is passed in
    useEffect(() => {
        setFormData(initialFormDetails);
    }, [initialFormDetails]);

    // Handles live typing in the form and updates the state of FormData to match current form values
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log('handleChange fired');
        setFormData((prevState: InvoiceRead) => ({
            ...prevState,
            [name]: value,
        }));
    };





    // Handle saving when a field loses focus
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;

        // The 'name' from an HTML input event is always a string.
        const fieldName = name as keyof InvoiceRead;

        // Prevent API call if the value hasn't actually changed.
        const originalValue = String(initialFormDetails[fieldName] ?? '');
        if (originalValue === value) {
            return; // No change, no need to save.
        }

        // Parse the value to its correct type before saving.
        let parsedValue: string | number | null = value;
        if (type === 'number') {
            parsedValue = value === '' ? null : parseFloat(value);
        }

        setIsSaving(true);

        // Explicitly provide the generic types to the handlePatchField function.

            await handlePatchField<typeof fieldName>(
                fieldName,
                parsedValue as InvoiceRead[typeof fieldName]
            );

    };


    return (
        <div className="container">
            <form>
                {/* Use a fieldset to easily disable the entire form while saving */}
                <fieldset disabled={isSaving}>
                    <div className="form-content">
                        <input type="hidden" name="id" value={formData.id || ''}/>

                        <div className="columns is-multiline">
                            {/* --- Row 1: Core Details --- */}
                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Invoice Number</label>
                                    <div className="control"><input className="input" type="text" name="invoice_number"
                                                                    value={formData.invoice_number || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Invoice Date</label>
                                    <div className="control"><input className="input" type="date" name="invoice_date"
                                                                    value={formData.invoice_date || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>


                            {/* --- Row 2: Supplier and Status --- */}
                            {/*Supplier Name, as found on the invoice, is displayed, but is not editable, beside a drop-down of possible suppliers.  User to pick the correct one  */}
                            <div className="column is-half">

                                <FormFieldWithPicker
                                    label="Supplier"
                                    fieldValue={formData.supplier_id}
                                    onLaunch={handleSupplierPickerClick}
                                    pickerArray={PickerSupplierArray}
                                ></FormFieldWithPicker>

                            </div>


                            {/* --- Row 3: References --- */}
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Customer Account Number</label>
                                    <div className="control"><input className="input" type="text"
                                                                    name="customer_account_number"
                                                                    value={formData.customer_account_number || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">User Reference</label>
                                    <div className="control"><input className="input" type="text" name="user_reference"
                                                                    value={formData.user_reference || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Supplier Reference</label>
                                    <div className="control"><input className="input" type="text"
                                                                    name="supplier_reference"
                                                                    value={formData.supplier_reference || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Document Type</label>
                                    <div className="control"><input className="input" type="text" name="document_type"
                                                                    value={formData.document_type || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>

                            {/* --- Row 4: Financials --- */}
                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Invoice Total</label>
                                    <div className="control"><input className="input" type="number" step="0.01"
                                                                    name="invoice_total"
                                                                    value={formData.invoice_total || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Delivery Cost</label>
                                    <div className="control"><input className="input" type="number" step="0.01"
                                                                    name="delivery_cost"
                                                                    value={formData.delivery_cost || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>


                            <div className="column is-one-third">


                                <div className="field">
                                    <label className="label" htmlFor="currency_code">Currency</label>
                                    <div className="control">
                                        {
                                            (!currencies || !currencies.length) ? (
                                                <p className="input is-static">Loading currencies...</p>
                                            ) : (
                                                <div className="select is-fullwidth">
                                                    <select
                                                        id="currency_code" name="currency_code"
                                                        value={formData.currency_code || 'GBP'} onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={isSaving} required
                                                    >
                                                        {/*Guard against 'undefined' to prevent crash when currencies not fully loaded. */}
                                                        {(currencies || []).map((currency) => (
                                                            <option key={currency.currency_code}
                                                                    value={currency.currency_code}>
                                                                {currency.currency_code} - {currency.currency_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>


                            </div>


                            {/* --- Row 5: Notes --- */}
                            <div className="column is-full">
                                <div className="field">
                                    <label className="label">Notes</label>
                                    <div className="control">
                                        <textarea className="textarea" name="notes" rows={4}
                                                  placeholder="Add any relevant notes here..."
                                                  value={formData.notes || ''} onChange={handleChange}
                                                  onBlur={handleBlur}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* --- Read-only Meta-data --- */}
                <div className="content is-small has-text-grey mt-5 pt-4" style={{borderTop: '1px solid #dbdbdb'}}>
                    <h6 className="subtitle is-6 has-text-grey">System Information (Read-Only)</h6>
                    <div className="columns is-multiline">
                        <div className="column is-half">
                            <p className="mb-1"><strong>Calculated Total:</strong> {formData.calculated_total}</p>
                            <p className="mb-1"><strong>Confidence Score:</strong> {formData.confidence_score}</p>
                        </div>
                        <div className="column is-half">
                            <p className="mb-1"><strong>Date
                                Added:</strong> {formData.date_added ? new Date(formData.date_added).toLocaleString() : 'N/A'}
                            </p>
                            <p className="mb-1"><strong>Last
                                Modified:</strong> {formData.date_modified ? new Date(formData.date_modified).toLocaleString() : 'N/A'}
                            </p>
                            <p className="mb-1"><strong>Parse Duration:</strong> {formData.parse_duration_ms}ms
                                | <strong>AI Tokens:</strong> {formData.parse_ai_tokens}</p>
                        </div>
                    </div>
                </div>


            </form>

            <PickerModal
                isPickerModalActive={isPickerModalActive}
                pickerArray={pickerArray}
                pickerTitle={pickerTitle}
                pickerOnSelect={pickerOnSelect}
                onClose={handlePickerClose}
                addNewFormActive={false}
                addNewComponent={undefined}/>
        </div>
    );
}

export default InvoiceMeta;
