// C:/web/bake/src/components/Invoice/InvoiceLineItem.tsx
import {type ILineItem} from '../../models/invoice';
import {type IGenericFormProps} from '../../models/IFormProps';
import {useFormLogic} from '../../hooks/useFormLogic';
import DeleteElement from '../Utility/DeleteElement.tsx';
import PickerModal from "../Picker/PickerModal.tsx";
import {useData} from "../../contexts/DataContext.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import ViewBuyableForm from "../Buyable/ViewBuyableForm.tsx";

const InvoiceLineItem = (props: IGenericFormProps<ILineItem>) => {
    const {formData, isSaving, onDelete} = props;

    const {
        isNew,
        pickerModalConfig,
        setPickerModalConfig,
        closePickerModal,
        toggleNewItemView,
        handleFocus,
        handleChange,
        handleValueChange,  // for programmatic changes, primarily triggered by picker
        handleEdit,
    } = useFormLogic({...props, primaryKeyName: 'id'});

    const uniqueId = formData.id;

    const {PickerBuyableArray} = useData();

    const buyablePickerOnSelect = async (selectedBuyableId: number) => {
        handleValueChange('buyable_id', selectedBuyableId);
        closePickerModal();

    };

    const openBuyablePicker = () => {
        setPickerModalConfig({
                addNewButtonText: "", onClose(): void | null {
                    return undefined;
                }, pickerSubtitle: undefined, showSearch: false,
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

                        <div className="column is-8-tablet">
                            <div className="field">
                                <label className="label" htmlFor={`description_${uniqueId}`}>Description</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        name="description"
                                        id={`description_${uniqueId}`}
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-tablet">
                            <div className="field">
                                <label className="label" htmlFor={`code_${uniqueId}`}>Product Code</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        name="code"
                                        id={`code_${uniqueId}`}
                                        value={formData.code || ''}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column is-1-tablet is-flex is-align-items-flex-end is-justify-content-flex-end">
                            {!isNew && uniqueId && (
                                <DeleteElement
                                    element_id={uniqueId}
                                    endpoint='invoice/lineitem'
                                    elementName={`line item: ${formData.description?.substring(0, 20)}...`}
                                    onDelete={onDelete}
                                />
                            )}
                        </div>

                        <div className="column is-full">
                            <div className="tags">
                                {(formData.cases && formData.cases > 0) ? (
                                    <span className="tag is-info is-light">Cases: {formData.cases}</span>
                                ) : null}

                                {(formData.units && formData.units > 0) ? (
                                    <span className="tag is-info is-light">Units: {formData.units}</span>
                                ) : null}
                                {(formData.size && formData.size.length > 0) ? (
                                    <span className="tag is-dark">Size: {formData.size}</span>
                                ): null}
                            </div>
                        </div>

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
                                           value={formData.vat_percentage?? ''} onChange={handleChange}
                                           onBlur={handleEdit} onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>

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
                                    <input
                                        className="input is-small"
                                           type="number"
                                           name="buyable_quantity"
                                           id={`buyable_quantity_${uniqueId}`}
                                           value={formData.buyable_quantity || ''}
                                           onChange={handleChange}
                                           onBlur={handleEdit}
                                           onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4-tablet">
                            <div className="field">
                                <label className="label is-small" htmlFor={`unit_cost_${uniqueId}`}>Unit Cost</label>
                                <div className="control">
                                    <input className="input is-small" type="number" step="0.01" name="unit_cost"
                                           id={`unit_cost_${uniqueId}`}
                                           value={formData.unit_cost || ''}
                                           onChange={handleChange}
                                           onBlur={handleEdit}
                                           onFocus={handleFocus}/>
                                </div>
                            </div>
                        </div>


                        <div className="column is-full">
                            <div className="field">
                                <div className="control">
                                    <label className="checkbox">
                                        <input type="checkbox" name="is_delivery"
                                               id={`is_delivery_${uniqueId}`}
                                               checked={formData.is_delivery || false}
                                               onChange={handleChange}
                                               onBlur={handleEdit}
                                               onFocus={handleFocus}/>
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