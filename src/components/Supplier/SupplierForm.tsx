import React from 'react';
import {type ISupplier} from '../../models/ISupplier.ts';
import DeleteElement from '../Utility/DeleteElement.tsx';
import {useData} from "../../contexts/DataContext.tsx";
import type {IGenericFormProps} from "../../models/IFormProps.ts";
import {useFormLogic} from "../../hooks/useFormLogic.ts";

const SupplierForm = (props: IGenericFormProps<ISupplier>) => {
    // No changes needed here
    const {formData, onSave, onChange, onEdit, onCancel, isSaving, onDelete, isModal = false} = props;
    const {
        isNew, focusInputRef, handleFocus, handleChange, handleValueChange, handleEdit, handleSubmit,
    } = useFormLogic({...props, primaryKeyName: 'supplier_id'});
    const api_endpoint = 'buyable/supplier';
    const {pickerCurrencyArray, currencies, loading} = useData();

    return (
        <form onSubmit={handleSubmit}>

            <div className="field">
                <label className="label" htmlFor="supplier_name">Supplier Name</label>
                <div className="control">
                    <input
                        ref={focusInputRef} id="supplier_name" className="input" type="text"
                        placeholder="e.g., Neill's flour Ltd." name="supplier_name"
                        value={formData.supplier_name || ''} onChange={handleChange} onBlur={handleEdit}
                        onFocus={handleFocus} disabled={isSaving} required
                    />
                </div>
            </div>

            {/* ... Contact Info, Email, Address */}
            <div className="field is-horizontal">
                <div className="field-body">
                    <div className="field"><label className="label" htmlFor="contact_person">Contact Person</label><div className="control"><input id="contact_person" className="input" type="text" name="contact_person" value={formData.contact_person || ''} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div>
                    <div className="field"><label className="label" htmlFor="phone_number">Phone Number</label><div className="control"><input id="phone_number" className="input" type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div>
                </div>
            </div>
            <div className="field"><label className="label" htmlFor="email_address">Email Address</label><div className="control"><input id="email_address" className="input" type="email" name="email_address" placeholder="e.g., orders@acme.com" value={formData.email_address || ''} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div>
            <div className="field"><label className="label" htmlFor="address">Address</label><div className="control"><textarea id="address" className="textarea" name="address" value={formData.address || ''} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div>


            {/* Account Details - CORRECTED BLOCK */}
            <div className="field is-horizontal">
                <div className="field-body">
                    <div className="field">
                        <label className="label" htmlFor="account_number">Account Number</label>
                        <div className="control">
                            <input id="account_number" className="input" type="text" name="account_number"
                                   value={formData.account_number || ''} onChange={handleChange} onBlur={handleEdit}
                                   onFocus={handleFocus} disabled={isSaving}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="currency_code">Currency</label>
                        <div className="control">
                            {loading['currencies'] ? (
                                <p className="input is-static">Loading currencies...</p>
                            ) : (
                                <div className="select is-fullwidth">
                                    <select
                                        id="currency_code" name="currency_code"
                                        value={formData.currency_code || 'GBP'} onChange={handleChange}
                                        onBlur={handleEdit} onFocus={handleFocus}
                                        disabled={isSaving} required
                                    >
                                        {/*Guard against 'undefined' to prevent crash when currencies not fully loaded. */}
                                        {(currencies || []).map((currency) => (
                                            <option key={currency.currency_code} value={currency.currency_code}>
                                                {currency.currency_code} - {currency.currency_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ... Order Values, Notes, and Action Buttons are fine ... */}
            <div className="field is-horizontal"><div className="field-body"><div className="field"><label className="label" htmlFor="minimum_order_value">Minimum Order Value</label><div className="control"><input id="minimum_order_value" className="input" type="number" step="any" name="minimum_order_value" value={formData.minimum_order_value || 0} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div><div className="field"><label className="label" htmlFor="delivery_charge">Standard Delivery Charge</label><div className="control"><input id="delivery_charge" className="input" type="number" step="any" name="delivery_charge" value={formData.delivery_charge || 0} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div></div></div>
            <div className="field"><label className="label" htmlFor="notes">Notes</label><div className="control"><textarea id="notes" className="textarea" placeholder="Any relevant notes..." name="notes" value={formData.notes || ''} onChange={handleChange} onBlur={handleEdit} onFocus={handleFocus} disabled={isSaving}/></div></div>
            <div className="field is-grouped">{isNew ? (<><div className="control"><button type="submit" className={`button is-primary ${isSaving ? 'is-loading' : ''}`} disabled={isSaving}>Create Supplier</button></div><div className="control"><button type="button" className="button is-light" onClick={onCancel} disabled={isSaving}>Cancel</button></div></>) : (<><div className="control"><p className="is-italic has-text-grey">Changes are saved automatically when you leave a field.</p></div><DeleteElement element_id={formData.supplier_id} endpoint={api_endpoint} elementName={formData.supplier_name} onDelete={onDelete}/></>)}</div>

        </form>
    )
}

export default SupplierForm;