import React, {useCallback, useEffect, useRef, useState} from 'react';
import {type Buyable} from '../../models/buyable.ts';
import {useShortcut} from '../../contexts/KeyboardShortcutContext.tsx';
import DeleteElement from '../Utility/DeleteElement.tsx';

import {type Brand} from '../../models/brand.ts';
import {type UnitOfMeasure} from '../../models/uom.ts';

import {useData} from "../../contexts/DataContext.tsx";
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import {createDefaultPickerModalConfig, type IPickerModalConfig} from "../../models/picker.ts";
import PickerModal from "../Picker/PickerModal.tsx";
import ViewBrandForm from "../Brand/ViewBrandForm.tsx";
import {useAuth} from "react-oidc-context";


interface BuyableFormProps {
    formData: Buyable;
    onSave: (updatedBuyable: Buyable) => void;
    onChange: (field_name: string, value: number | string | boolean ) => void;
    onCancel: () => void;
    onEdit: (field_name: string, value: number | string | boolean ) => void;

    isSaving: boolean;
    onDelete: () => void;
    isModal: boolean;
}

const BuyableForm = ({
                         formData,
                         onSave,
                         onChange,
                         onCancel,
                         onEdit,
                         isSaving,
                         onDelete,
                         isModal=false

                     }: BuyableFormProps) => {
        const isNew = formData.id === 0;
        const focusInputRef = useRef<HTMLInputElement>(null);
        const primary_key_name = 'id';
        const auth = useAuth();
        // holds initial value of the currently selected field at point in time when it's selected, for comparison to modified value when field loses focus
        const [originalValueOnFocus, setOriginalValueOnFocus] = useState<any>(null);
        // Define picker modal props - can then be set by different onClick events to  todo - move the definition to an interface and create a default set of data to populate - help avoid set up errors
        const [pickerModalConfig, setPickerModalConfig] = useState<IPickerModalConfig>(createDefaultPickerModalConfig());
        const api_endpoint = 'buyable';  // todo - consider making this part of a config dataset rather than redeclaring here
        // Set up Brand Picker modal
        const openBrandPicker = () => {
            // define the modal's config for when the brand picker button is clicked
            console.log(`openBrandPicker clicked - setting modal config to Brand`);
            setPickerModalConfig({
                isPickerModalActive: true,
                pickerArray: PickerBrandArray,
                pickerTitle: "Brand",
                pickerOnSelect: brandPickerOnSelect,
                addNewFormActive: false,
                pickerOnAddNewClicked: () => {
                    // behaviour of the Add New button in the picker.  As this is a modal view, want to simply flip
                    // the addNewFormActive boolean to switch between the picker and the add new form.
                    toggleNewItemView()
                },
                addNewComponent: (
                    //     passing in JSX that can be rendered within the child element.  By passing element_id == new
                    // a blank form will be presented to populate a new item
                    <ViewBrandForm
                        prop_element_id='new'
                        onSuccess={brandPickerOnSelect}  // expected to be passed the ID of the newly created item
                        isModal={true}  // deactivates shortcuts when form is displaed as a modal
                    />
                )
            })

        }

        const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            // stores the initial value of the field when it's clicked into.
            // when user clicks out, this value is compared to the current value to determine if changes have been made
            // and whether or not to fire the handleEdit function to PATCH to API.
            setOriginalValueOnFocus(e.target.value);  // todo - could apply similar logic for when picker is selected to determine if an api call is necessary.  Or just not bother as tabbing through won't trigger an API call
        };

        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

            const { name, type } = e.target;
            console.log(`handle change for field ${name} and type ${type}`);
            // Determine the new value based on the input type
            const value = type === 'checkbox'
                ? (e.target as HTMLInputElement).checked // For checkboxes, use the 'checked' boolean
                : e.target.value;                       // For all others, use 'value'
            onChange(name, value);

        }, [onChange]);



        const handleEdit = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

            if (!formData || formData[primary_key_name] === 0) {
                return;
            }
            if (!auth.user?.access_token) {
                showFlashMessage("Authentication error. Please log in again.", 'danger');
                return;
            }

            const { name, type } = e.target;

            // Determine the new value based on the input type,as in handleChange
            const value = type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : e.target.value;

            // The comparison now works correctly for both strings and booleans
            if (originalValueOnFocus === value) {
                console.log(`No change detected for field '${name}'. Skipping PATCH.`);
                return;
            }

            try {
                onEdit(name, value);
            } catch (error) {
                console.error(error);
                showFlashMessage(error instanceof Error ? error.message : 'An unknown error occurred - changes were not saved', 'danger');
            } 
        };


        // function to close modal, regardless of type, and overwrite details back to defaults to avoid unexpected behaviour on next load
        const closePickerModal = () => {
            setPickerModalConfig(createDefaultPickerModalConfig());
        };

        const toggleNewItemView = () => {
            // flip the addNewFormActive flag to true to make the modal switch from list viewer to add new form
            // allows for toggling betwen list view and add new view with the same callback function
            setPickerModalConfig(prev => ({...prev, addNewFormActive: !prev.addNewFormActive}))

        }

        const {brands, PickerBrandArray} = useData();
        const {units} = useUnitOfMeasures();

        useEffect(() => {
            focusInputRef.current?.focus();
        }, []);

        const handleSave = useCallback(() => {
            onSave(formData);
        }, [formData, onSave]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            handleSave();
        };

        const brandPickerOnSelect = async (newBrandId: number) => {
            // persist the new supplier id to the database
            console.log(`brandPickerOnSelect called with value ${newBrandId}`);
            // added guard clause - when the form is for a new element, can't PATCH the update, so just save the data to the formData, it will then persist once the save form is done
            onEdit('brand_id', newBrandId);  // this should push the new id to the database and update the form with the returned data
            closePickerModal();
        }


// todo - consider if this will cause conflicts if the form is called from a modal- may need to disable shortcuts in modal version of form - pass an 'isModal' prop to identify?
        if (!isModal){
        useShortcut('Enter', isNew ? handleSave : null, {ctrl: true});
        }

        return (

            <>

                <form onSubmit={handleSubmit}>
                    {/* Item Name Input */}
                    <div className="field">
                        <label className="label" htmlFor="item_name">Item Name</label>
                        <div className="control">
                            <input
                                ref={focusInputRef}
                                id="item_name"
                                className="input"
                                type="text"
                                placeholder="e.g., All-Purpose Flour"
                                name="item_name"
                                value={formData.item_name || ''}
                                onChange={handleChange}
                                onBlur={handleEdit}
                                onFocus={handleFocus}
                                disabled={isSaving}
                                required
                            />
                        </div>
                    </div>

                    {/* SKU Input */}
                    <div className="field">
                        <label className="label" htmlFor="sku">SKU</label>
                        <div className="control">
                            <input
                                id="sku"
                                className="input"
                                type="text"
                                placeholder="Supplier's SKU or your own"
                                name="sku"
                                value={formData.sku || ''}
                                onChange={handleChange}
                                onBlur={handleEdit}
                                onFocus={handleFocus}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    {formData.brand_id}
                    <FormFieldWithPicker
                        label="Brand"
                        fieldValue={formData.brand_id}
                        onLaunch={openBrandPicker}
                        pickerArray={PickerBrandArray}

                    ></FormFieldWithPicker>


                    {/* UOM and Quantity */}
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <label className="label" htmlFor="uom_id">Unit of Measure</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id="uom_id"
                                            name="uom_id"
                                            value={formData.uom_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select a unit...</option>
                                            {units.map((uom) => (
                                                <option key={uom.uom_id} value={uom.uom_id}>
                                                    {uom.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="quantity">Quantity</label>
                                <div className="control">
                                    <input
                                        id="quantity"
                                        className="input"
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 5"
                                        name="quantity"
                                        value={formData.quantity || ''}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Is Active Checkbox */}
                    <div className="field">
                        <div className="control">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    onBlur={handleEdit}
                                    disabled={isSaving}
                                />
                                {' '}Is Active
                            </label>
                        </div>
                    </div>

                    {/* Notes Textarea */}
                    <div className="field">
                        <label className="label" htmlFor="notes">Notes</label>
                        <div className="control">
                    <textarea
                        id="notes"
                        className="textarea"
                        placeholder="Any relevant notes..."
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                    />
                        </div>
                    </div>

                    {/* Timestamps (Read-Only) */}
                    <div className="field">
                        <label className="label">Timestamps</label>
                        <p className="is-size-7">
                            Created: {formData.created_timestamp ? new Date(formData.created_timestamp).toLocaleString() : 'N/A'}
                            <br/>
                            Modified: {formData.modified_timestamp ? new Date(formData.modified_timestamp).toLocaleString() : 'N/A'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="field is-grouped">
                        {isNew ? (
                            <>
                                <div className="control">
                                    <button
                                        type="submit"
                                        className={`button is-primary ${isSaving ? 'is-loading' : ''}`}
                                        disabled={isSaving}
                                    >

                                        Create Item (CTRL+Enter)
                                    </button>
                                {/*    if being displayed in modal view, can't use shortcut as may interfere with shortcut declared in calling form  - conditionally disable? */}
                                </div>
                                <div className="control">
                                    <button type="button" className="button is-light" onClick={onCancel}
                                            disabled={isSaving}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="control">
                                    <p className="is-italic has-text-grey">Changes are saved automatically.</p>
                                </div>
                                <DeleteElement
                                    element_id={formData.id}
                                    endpoint='buyable'
                                    elementName={formData.item_name}  // friendly name for the element being deleted
                                    onDelete={onDelete}
                                />
                            </>
                        )}
                    </div>
                </form>

                <PickerModal
                    isPickerModalActive={pickerModalConfig.isPickerModalActive}
                    pickerArray={pickerModalConfig.pickerArray}
                    pickerTitle={pickerModalConfig.pickerTitle}
                    pickerOnSelect={pickerModalConfig.pickerOnSelect}
                    addNewFormActive={pickerModalConfig.addNewFormActive}
                    onClose={closePickerModal}
                    pickerOnAddNewClicked={pickerModalConfig.pickerOnAddNewClicked}
                    addNewComponent={pickerModalConfig.addNewComponent}
                />


            </>

        );
    }
;

export default BuyableForm;