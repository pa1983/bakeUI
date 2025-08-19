// C:/web/bake/src/components/Invoice/InvoiceLineItem.tsx

import React from 'react';
import {type LineItemRead} from '../../models/invoice';
import {type IGenericFormProps} from '../../models/IFormProps';
import {useFormLogic} from '../../hooks/useFormLogic';
import DeleteElement from '../Utility/DeleteElement.tsx';
import PickerModal from "../Picker/PickerModal.tsx";
import {useData} from "../../contexts/DataContext.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import ViewBuyableForm from "../Buyable/ViewBuyableForm.tsx";

const InvoiceLineItem = (props: IGenericFormProps<LineItemRead>) => {
    const {formData, isSaving, onDelete} = props;

    const {
        isNew,
        focusInputRef,
        pickerModalConfig,
        setPickerModalConfig,
        closePickerModal,
        toggleNewItemView,
        handleFocus,
        handleChange,
        handleValueChange,  // for programatic changes, primarily triggered by picker
        handleEdit,
        handleSubmit,
    } = useFormLogic({...props, primaryKeyName: 'id'});

    const uniqueId = formData.id;

    const {PickerBuyableArray} = useData();

    const buyablePickerOnSelect = async (selectedBuyableId: number) => {
        console.log(`buyablepickeronselect called with value ${selectedBuyableId}`);
        handleValueChange('buyable_id', selectedBuyableId);
        closePickerModal();

    };

    const openBuyablePicker = () => {
        setPickerModalConfig({
                isPickerModalActive: true,
                pickerArray: PickerBuyableArray,
                pickerTitle: "Buyable Item",
                pickerOnSelect: buyablePickerOnSelect,
                addNewFormActive: false,
                pickerOnAddNewClicked: () => {
                    toggleNewItemView()
                },
                addNewComponent: (
                    <ViewBuyableForm
                        prop_element_id='new'
                        onSuccess={buyablePickerOnSelect}  // expected to be passed the ID of the newly created item
                        isModal={true}
                    />
                )
            }
        )
    }

    return (
        <>
            <li className="box mb-3">
                <fieldset disabled={isSaving}>
                    <div className="columns is-multiline is-vcentered is-mobile">

                        {/* --- Row 1: Display-only guide information --- */}
                        <div className="column is-full">
                            <div className="level is-mobile mb-2">
                                <div className="level-left">
                                    <p className="title is-4 has-text-white has-text-weight-semibold">{formData.description}</p>
                                </div>
                                <div className="level-right">
                                    {!isNew && (
                                        <DeleteElement
                                            element_id={uniqueId}
                                            endpoint='invoice/lineitem'
                                            elementName={`line item: ${formData.description.substring(0, 20)}...`}
                                            onDelete={onDelete}
                                            isSmall={true}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="tags">
                                {formData.cases &&
                                <span className="tag is-info is-light">Cases: {formData.cases ?? 'N/A'}</span>}
                                {formData.units &&
                                <span className="tag is-info is-light">Units: {formData.units ?? 'N/A'}</span>}
                                {formData.size &&
                                <span className="tag is-dark">Size: {formData.size ?? 'N/A'}</span>}
                                {formData.code &&
                                <span className="tag is-dark">Code: {formData.code ?? 'N/A'}</span>}
                            </div>
                        </div>

                        {/* --- Row 2: Editable financial fields --- */}
                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`value_ex_vat_${uniqueId}`}>Value (Ex.
                                    VAT)</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="0.01" name="value_ex_vat"
                                           value={formData.value_ex_vat || ''} onChange={handleChange}
                                           onBlur={handleEdit} onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`value_inc_vat_${uniqueId}`}>Value (Inc.
                                    VAT)</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="0.01" name="value_inc_vat"
                                           value={formData.value_inc_vat || ''} onChange={handleChange}
                                           onBlur={handleEdit} onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`vat_percentage_${uniqueId}`}>VAT %</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="0.01" name="vat_percentage"
                                           value={formData.vat_percentage || ''} onChange={handleChange}
                                           onBlur={handleEdit} onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>

                        {/* --- Row 3: Editable matching fields --- */}


                        <FormFieldWithPicker
                            label="Buyable Item"
                            fieldValue={formData.buyable_id}
                            onLaunch={openBuyablePicker}
                            pickerArray={PickerBuyableArray}
                        />


                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`buyable_quantity_${uniqueId}`}>Buyable
                                    Quantity</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="any" name="buyable_quantity"
                                           value={formData.buyable_quantity || ''} onChange={handleChange}
                                           onBlur={handleEdit} onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`unit_cost_${uniqueId}`}>Unit Cost</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="0.01" name="unit_cost"
                                           value={formData.unit_cost || ''} onChange={handleChange} onBlur={handleEdit}
                                           onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>

                        {/* --- Row 4: Flags --- */}
                        <div className="column is-full">
                            <div className="field">
                                <div className="control">
                                    <label className="checkbox">
                                        <input type="checkbox" name="is_delivery"
                                               checked={formData.is_delivery || false} onChange={handleChange}
                                               onBlur={handleEdit} onFocus={handleFocus}/>
                                        <span className="ml-2">Is Delivery Charge</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </li>

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
};

export default InvoiceLineItem;