
import {type IBuyable} from '../../models/IBuyable.ts';
import DeleteElement from '../Utility/DeleteElement.tsx';
import {useData} from "../../contexts/DataContext.tsx";
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import PickerModal from "../Picker/PickerModal.tsx";
import ViewBrandForm from "../Brand/ViewBrandForm.tsx";
import {type IGenericFormProps} from "../../models/IFormProps.ts";
import {useFormLogic} from "../../hooks/useFormLogic.ts";


const BuyableForm = (props: IGenericFormProps<IBuyable>) => {
        const {formData, onCancel, isSaving, onDelete} = props;

        // --- 1. Call the custom hook to get all the generic logic and handlers ---
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

        // DEFINE NON-STANDARD FORM ELEMENTS, e.g. pickerConfig, data sources

        // Define data souorces - these are pulled from contexts
        const {PickerBrandArray} = useData();
        const {units} = useUnitOfMeasures();

        const brandPickerOnSelect = (selectedBrandId: number|string ) => {
            // persist the new brand id to the database.  This isn't part of the useFormLogic hook as it deviates from
            // from the standard handling of change to a form field.
            // It IS common to all pickers
            console.log(`brandPickerOnSelect called with value ${selectedBrandId}`);
            // added guard clause - when the form is for a new element, can't PATCH the update,
            // so just save the data to the formData, it will then persist once the save form is done
            handleValueChange('brand_id', selectedBrandId);
            // onChange('brand_id', selectedBrandId)
            // if (!isNew) {
            //     // if form is not for a new entry, also push the change to the db
            //     onEdit('brand_id', selectedBrandId);  // this should push the new id to the database and update the form with the returned data
            // };  // todo - this works, but hints that perhaps i've got some logic error in useFormLogic.
            closePickerModal();
        }

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
                    // Behaviour of the Add New button in the picker.  As this is a modal view, want to simply flip
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
                ), onClose(): void | null {
                    return undefined;
                },  // todo - consider correct behaviour for onClose here
                pickerSubtitle: "Pick a brand..."
            })

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