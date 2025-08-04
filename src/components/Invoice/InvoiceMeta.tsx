// display form containing all the invoice's meta data
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import useFlash from '../../contexts/FlashContext.tsx';
import useAlert from "../../contexts/CustomAlertContext.tsx";
import {patchField} from '../../services/commonService.ts';
import {useAuth} from 'react-oidc-context';
import {useInvoice} from "../../contexts/InvoiceContext.tsx";
import {type Currency} from "../../models/currency.ts";
import {type Supplier} from "../../models/supplier.ts";
import PickerModal from "../Picker/PickerModal.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import {type PickerElement} from "../../models/picker.ts";


// display form containing all the invoice's meta data - use generic name for initialFormDetails so can reuse code snippets in other forms without refactoring
function InvoiceMeta({initialFormDetails}: { initialFormDetails: any }) {
    const [formData, setFormData] = useState(initialFormDetails);
    const [isSaving, setIsSaving] = useState(false); // State to disable form during save
    const api_endpoint = `invoice`;
    // picker controls
    const [isPickerModalActive, setIsPickerModalActive] = useState<boolean>(false);
    const [pickerArray, setPickerArray] = useState<[] | PickerElement[]>([]);  // array to be passed to picker to make selections from
    const [pickerTitle, setPickerTitle] = useState<string>('');  // text descriptor for the picker popup
    const [pickerOnSelect, setPickerOnSelect] = useState(() => () => {
    }); // A no-op function as default- better than null as unexpected call to pickerOnSelect here will have no effect; call to null() would throw an error

    // same function for picker close can be used by all possible instances of picker being called - other fields do need to change
    const handlePickerClose = useCallback(() => {
        setIsPickerModalActive(false);
    }, []);

    // get context data for use in form and pickers
    const {currencies, suppliers, refetchInvoiceFormData} = useInvoice();

    // now map the currency and supplier arrays into correct shape for picker.
    // Memoize the calc'd array to avoid recalculation on every render of InvoiceMeta.
    // Make depandent on currencies - only re-create the array if currencies changes
    // use this format for all other utilisations of Picker component
    const pickerCurrencyArray = useMemo(() => {

        return currencies.map((currency: Currency): PickerElement[] => ({
            id: currency.currency_code,
            title: `${currency.symbol} - ${currency.currency_name}`,
            subtitle: currency.currency_code,
            imageUrl: ''  // todo - create image icons for currencies and make them callable by the currency code so no need to for a link saved in currency table

        }))
    }, [currencies]);

    const PickerSupplierArray = useMemo(() => {

        return suppliers.map((supplier: Supplier): PickerElement[] => ({
            id: supplier.supplier_id,
            title: supplier.supplier_name,
            subtitle: supplier.account_number,
            imageUrl: ''  // todo - add images for supplier

        }))
    }, [currencies]);

    const updateCurrency = (newCurrencyValue: string) => {
        // take a shallow copy of the exisitng state, then overwrite the changed element.
        //  the creation of a new for object will trigger a re-render, ensuring the change is reflected throughout the component
        setFormData((prevState: any) => ({...prevState, currency_code: newCurrencyValue}));
    }

    const updateSupplier = (newSupplierValue: number) => {
        setFormData((prevState: any) => ({...prevState, supplier_id: newSupplierValue}));
    }

    // FUNCTIONS LINKED TO CURRENCY PICKER SETUP - will be similar for supplier picker

    const currencyPickerOnSelect = async (newCurrencyCode: string): PickerElement[] => {
        // onselect needs to be set to update the currency id value in the form; the picker modal will inject the necessary logic to close itself so
        // that doesn't need duplicated here
        updateCurrency(newCurrencyCode);  // to update the value as displayed in the form
        await handlePatchField('currency_code', newCurrencyCode, api_endpoint);  // to check if the value has changed and push to DB if required
        setIsPickerModalActive(false);  // then finally close down the modal
    };

    const supplierPickerOnSelect = async (newSupplierId: number): PickerElement[] => {
        updateSupplier(newSupplierId);  // update supplier ID in the local formData object
        await handlePatchField('supplier_id', newSupplierId, api_endpoint);  // persist the new supplier id to the database
        setIsPickerModalActive(false);  // close the modal

    }


    // Function called when the currency picker button is clicked - sets values for the picker modal, then activates the modal
    // use callback here to only re-create the function when the pickerCurrencyArray changes
    // todo - get this working then duplicate for suppliers.  Copy a good working example into the pickerModal as a use-case example for future use
    const handleCurrencyPickerClick = useCallback(() => {
            // button for launch currency picker was clicked - set picker variables to populate the picker with currency data, and make it visible
            console.log("currency picker clicked");
            setPickerTitle("Currency");
            setPickerArray(pickerCurrencyArray);
            setIsPickerModalActive(true);
            setPickerOnSelect(() => currencyPickerOnSelect);

        }
        , [pickerCurrencyArray, currencyPickerOnSelect]);


    const handleSupplierPickerClick = useCallback(() => {
        console.log("supplier picker clicked");
        setPickerTitle("Supplier");
        setPickerArray(PickerSupplierArray);
        setIsPickerModalActive(true);
        setPickerOnSelect(() => supplierPickerOnSelect);
    })

    const {showFlashMessage} = useFlash();
    const {showAlert} = useAlert();
    const auth = useAuth();

    // Reset form state if a new invoice is passed in
    useEffect(() => {
        setFormData(initialFormDetails);
    }, [initialFormDetails]);

    // Handles live typing in the form and updates the state of FormData to match current form values
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log('handleChange fired');
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handlePatchField = async (name: string, value: any, api_endpoint:string) => {
        // when reusing this function, need to set the correct endpoint here so can reuse the patchField function for all forms
        // decoupled from handleBlur to allow same save logic to be called by picker's onSelect callback (on blur not called by a JS function updating the function)
        // 1. Check if the value has actually changed. Convert all values to string before comparison since form values are always string.
        console.log(`comparing ${String(initialFormDetails[name] ?? '')} to ${value} for field: ${name}`);
        if (String(initialFormDetails[name] ?? '') === value) {
            console.log("No change detected, skipping save.");
            return; // Exit if there's no change
        }
        try {
            // 2. Call API to update the specific field
            // await updateInvoiceField(auth.user.access_token, formData.id, { [name]: value });
            if (!auth.user) {
                showFlashMessage("You must log in to proceed", "danger");
            } else {
                const res = await patchField(auth.user.access_token, initialFormDetails.id, name, value, api_endpoint);
                showFlashMessage(res.message, 'success');
            }

        } catch (error) {
            console.error("Failed to update field:", error);
            showFlashMessage(`Error saving ${name}. Please try again.`, 'danger');
            // todo: Revert the field to its original value on error
            setFormData(initialFormDetails);
        } finally {
            console.log('trying to set is saving to false to reactivate the form after a change has been saved');
            setIsSaving(false);
            console.log(`is saving? ${isSaving}`);
        }

    }


    // Handle saving when a field loses focus
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log(`Saving field: ${name} with value: ${value}`);
        setIsSaving(true);
        await handlePatchField(name, value, api_endpoint);
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
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
                                                                    value={formatDateForInput(formData.invoice_date)}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>
                                </div>
                            </div>


                            {/* --- Row 2: Supplier and Status --- */}
                            {/*Supplier Name, as found on invoice, is displayed, but is not editable, beside a drop down of possible suppliers.  User to pick correct one  */}
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


                                <FormFieldWithPicker
                                    label="Currency"
                                    fieldName="currency_code"
                                    fieldValue={formData.currency_code}
                                    onLaunch={handleCurrencyPickerClick}
                                    pickerArray={pickerCurrencyArray}
                                ></FormFieldWithPicker>


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
                            <p className="mb-1"><strong>Invoice ID:</strong> {formData.id}</p>
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
                {/*invoice data context data */}
                <div className="content is-small has-text-grey mt-5 pt-4" style={{borderTop: '1px solid #dbdbdb'}}>
                    <h6 className="subtitle is-6 has-text-grey">Invoice Context</h6>
                    <div className="columns is-multiline">
                        <div className="column is-half">
                            {/* Use .map() because it returns an array of elements to render */}
                            {suppliers.map((supplier) => (
                                <p key={supplier.supplier_id} className="mb-1"> {/* Added a unique key */}
                                    <strong>{supplier.supplier_name}</strong> {supplier.currency}
                                </p>
                            ))}
                            {currencies.map((currency) => (
                                <p key={currency.currency_code} className="mb-1"> {/* Added a unique key */}
                                    <strong>{currency.currency_name}</strong> {currency.symbol}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>


            </form>

            <PickerModal
                isActive={isPickerModalActive}
                pickerArray={pickerArray}
                pickerTitle={pickerTitle}
                onSelect={pickerOnSelect}
                // onClose={pickerOnClose}
                onClose={handlePickerClose}
            />
        </div>
    );
}

export default InvoiceMeta;
