// display form containing all the invoice's meta data
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import useFlash from '../contexts/FlashContext.tsx'; // Assuming this is your flash message hook
import useAlert from "../contexts/CustomAlertContext.tsx";
import SupplierPicker from "./SupplierPicker.tsx";
import {patchInvoiceField} from '../services/InvoiceServices.ts';
import {useAuth} from 'react-oidc-context';
import {useInvoice} from "../contexts/InvoiceContext.tsx";
import {type Currency} from "../models/currency.ts";
import {type Supplier} from "../models/supplier.ts";
import PickerModal from "./PickerModal.tsx";

// display form containing all the invoice's meta data
function InvoiceMeta({invoice_details, auth_token}: { invoice_details: any, auth_token: string }) {
    const [formData, setFormData] = useState(invoice_details);
    const [isSaving, setIsSaving] = useState(false); // State to disable form during save

    // picker controls
    const [isPickerModalActive, setIsPickerModalActive] = useState(false);
    const [pickerArray, setPickerArray] = useState([]);  // array to be passed to picker to make selections from
    const [pickerTitle, setPickerTitle] = useState('');  // text descriptor for the picker popup
    const [pickerOnSelect, setPickerOnSelect] = useState(() => () => {}); // A no-op function as default- better than null as unexpected call to pickerOnSelect here will have no effect; call to null() would throw an error
    const [pickerOnClose, setPickerOnClose] = useState(() => setIsPickerModalActive(false)); // default onClose behaviour - close the modal and do nothing else.  Leaves option option to override in future if required

    const {currencies, suppliers, refetchInvoiceContext} = useInvoice();

    // now map the currency and supplier arrays into correct shape for picker.
    // Memoize the calc'd array to avoid recalculation on every render of InvoiceMeta.
    // Make depandent on currencies - only re-create the array if currencies changes
    // use this format for all other utilisations of Picker component
    const pickerCurrencyArray = useMemo(() => {

        return currencies.map((currency: Currency) => ({
            id: currency.currency_code,
            title: `${currency.symbol} - ${currency.currency_name}`,
            subtitle: currency.currency_code,
            imageUrl: ''  // todo - create image icons for currencies and make them callable by the currency code so no need to for a link saved in currency table

        }))
    }, [currencies]);

    const updateCurrency = (newCurrencyValue => {
        // take a shallow copy of the exisitng state, then overwrite the changed element.
        //  the creation of a new for object will trigger a re-render, ensuring the change is reflected throughout the component
        setFormData(prevState => ({...prevState, currency: newCurrencyValue}));
    })

    // FUNCTIONS LINKED TO CURRENCY PICKER SETUP - will be similar for supplier picker

    const currencyPickerOnSelect = (newCurrencyCode) => {
        // onselect needs to be set to update the currency id value in the form; the picker modal will inject the necessary logic to close itself so
        // that doesn't need duplicated here
        updateCurrency(newCurrencyCode);
        setIsPickerModalActive(false);
    };


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


    const {showFlashMessage} = useFlash();
    const {showAlert} = useAlert();
    const auth = useAuth();

    console.log("currencies: ");
    console.log(currencies[0]);

    // Reset form state if a new invoice is passed in
    useEffect(() => {
        setFormData(invoice_details);
    }, [invoice_details]);

    // Handles live typing in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log('handleChange fired');
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



    // Handle saving when a field loses focus
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        // 1. Check if the value has actually changed. Convert all values to string before comparison since form values are always string.
        console.log(`comparing ${String(invoice_details[name] ?? '')} to ${value} for field: ${name}`);
        if (String(invoice_details[name] ?? '') === value) {
            console.log("No change detected, skipping save.");
            return; // Exit if there's no change
        }

        setIsSaving(true);
        console.log(`Saving field: ${name} with value: ${value}`);

        try {
            // 2. Call API to update the specific field
            // await updateInvoiceField(auth.user.access_token, formData.id, { [name]: value });
            const res = await patchInvoiceField(auth.user?.access_token, invoice_details.id, name, value);
            // todo - if success, console.log the change. if fail, flash error.
            showFlashMessage(res.message, 'success');
            // todo - update the original `invoice_details` prop in the parent component here so the "is changed" check works for subsequent edits.
            // do I need to pass in a useEffect to allow for updaing the invoice details values?

        } catch (error) {
            console.error("Failed to update field:", error);
            showFlashMessage(`Error saving ${name}. Please try again.`, 'danger');
            // todo: Revert the field to its original value on error
            setFormData(invoice_details);
        } finally {
            setIsSaving(false);
        }
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
                                <SupplierPicker supplierName={formData.supplier_name}
                                                selectedSupplierId={formData.supplier_id || ''}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}/>
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
                                    <label className="label">Currency</label>

                                    <div className="control"><input className="input" type="text" name="currency"
                                                                    value={formData.currency || ''}
                                                                    onChange={handleChange} onBlur={handleBlur}/></div>

                                    {/* 1. Clicking the picker icon sets picker variables to the currency-specific values, then opens the modal.
                                     2. The onSelect callback passed to the picker, and on to the picker element (which sets the formData currency value
                                     to the ID of the clicked item) is executed by elements onClick (along with request to close the modal).

                                     todo - last step is to render the currency ID as a currency value on the form; in this case it may not matter,
                                     but items such as supplier need the supplier ID, as stored in the formdata, to be displaed as the supplier name to be user-friendly
                                     */}
                                    <i className="fa-solid fa-list" onClick={handleCurrencyPickerClick}
                                       title="click to select a different currency"></i>
                                    {/*todo - add functionality to take the click event and use it to identify where to return the selected element ID to*/}
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
            {/*// do i just need a set up function at the head for every picker element, then the various re-shaped data elements are set to picker array when it's clicked? */}
            <PickerModal
                isActive={isPickerModalActive}
                pickerArray={pickerArray}
                pickerTitle={pickerTitle}
                onSelect={pickerOnSelect}
                onClose={pickerOnClose}
            />
            {/*    do i need an onClose?  YES - this is where I pass in the local state to the picker so it knows what to change to false, but it will always be the same -
            doesn't need to change for each call of the picker modal*/}
        </div>
    );
}

export default InvoiceMeta;
