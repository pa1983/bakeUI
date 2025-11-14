import {useFormLogic} from "../../hooks/useFormLogic.ts";
import DeleteElement from "../Utility/DeleteElement.tsx";
import type {IGenericFormProps} from "../../models/IFormProps.ts";
import type {IProductionLog} from "../../models/IProductionLog.ts";
import FormFieldWithPicker from "../Picker/FormFieldWithPicker.tsx";
import {useMemo} from "react";
import {useData} from "../../contexts/DataContext.tsx";
import PickerModal from "../Picker/PickerModal.tsx";
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";
import ViewProductionForm from "./ViewProductionForm.tsx";
import MoreInfo from "../Home/MoreInfo.tsx";
// import {BuyableUOMInfo} from "../Buyable/BuyableUOMInfo.tsx";
import ProductionTypeSelector from "./ProductionTypeSelector.tsx";

const ProductionForm = (props: IGenericFormProps<IProductionLog>) => {
    const {formData, onCancel, isSaving, onDelete} = props;
    const {
        isNew,
        pickerModalConfig,
        setPickerModalConfig,
        closePickerModal,
        toggleNewItemView,
        handleFocus,
        handleChange,
        handleValueChange,
        handleEdit,
        handleSubmit,
    } = useFormLogic({...props, primaryKeyName: 'id'});

    // get recipes from data context for use in populating production recipe picker
    const {PickerRecipeArray} = useData();
    const {units} = useUnitOfMeasures();
    console.log('production form data: ');
    console.log(formData);

    // todo - add function here to handlesubmit in the normal way, then redirect back to the full list and trigger a pull of data to refresh full list
    // const handleNew

    const recipeName = useMemo(() => {
        const recipe = PickerRecipeArray.find(r => r.id === formData.recipe_id);
        return recipe ? String(recipe.title) : `Recipe ID ${formData.recipe_id}`;
    }, [PickerRecipeArray, formData.recipe_id]);


    const recipePickerOnSelect = (selectedRecipeId: number) => {
        // persist the new recipe id to the database.  This isn't part of the useFormLogic hook as it deviates
        // from the standard handling of change to a form field.
        // It IS common to all pickers
        console.log(`recipe PickerOnSelect called with value ${selectedRecipeId}`);
        // added guard clause - when the form is for a new element, can't PATCH the update,
        // so just save the data to the formData, it will then persist once the save form is done
        handleValueChange('recipe_id', selectedRecipeId);
        closePickerModal();
    }


    const openRecipePicker = () => {
        console.log(`opening recipe picker`);
        setPickerModalConfig({
            isPickerModalActive: true,
            pickerArray: PickerRecipeArray,
            pickerTitle: "Recipe",
            pickerOnSelect: recipePickerOnSelect,
            addNewFormActive: false,
            pickerOnAddNewClicked: () => {
                // Behaviour of the Add New button in the picker.  As this is a modal view, want to simply flip
                // the addNewFormActive boolean to switch between the picker and the 'add new' form.
                toggleNewItemView()
            },
            addNewComponent: (
                //     passing in JSX that can be rendered within the child element.  By passing element_id == new,
                // a blank form will be presented to populate a new item
                <ViewProductionForm
                    prop_element_id='new'
                    onSuccess={recipePickerOnSelect}  // expected to be passed the ID of the newly created item
                    isModal={true}  // deactivates shortcuts when the form is displayed as a modal
                />
            ), onClose(): void | null {
                return undefined;
            },  // todo - consider correct behaviour for onClose here
            pickerSubtitle: "Pick a brand..."
        })
    }

    // no picker definitions required in labourer form
    const productionTypeOnChange = (value: number) => {
        handleValueChange('production_type_id', value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                {/*    Recipe Picker and Production Type */}
                <div className="field is-horizontal">
                    <div className="field-body">
                        <div className="field">
                            <FormFieldWithPicker
                                label="Recipe"
                                fieldValue={formData.recipe_id}
                                onLaunch={openRecipePicker}
                                pickerArray={PickerRecipeArray}
                            />
                        </div>
                        <div className="field">
                            <div className="label">Production Type <MoreInfo message={"The default value is 'Product' for saleable items.  \n\n" +
                                "Select 'Samples' for batches produced during testing that will not be sold. \n\n" +
                                "Select 'Waste' for batches that will be disposed of. " +
                                "Accurate accounting is essential in order to calculate accurate ingredient utilisation."}/></div>
                            <ProductionTypeSelector
                                value={formData.production_type_id || 1}
                                onChange={productionTypeOnChange}/>
                        </div>
                    </div>
                </div>
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
                        Created: {formData.created_at ? new Date(formData.created_at).toLocaleString() : 'N/A'}
                        <br/>
                        Modified: {formData.updated_at ? new Date(formData.updated_at).toLocaleString() : 'N/A'}
                    </p>
                </div>

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
                                {/*    if being displayed in the modal view, can't use shortcut as may interfere with the shortcut declared in calling form - conditionally disable? */}
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
                                <p className="is-italic bake-subtitle-subtle">Changes are saved
                                    automatically.</p>
                            </div>
                            <DeleteElement
                                element_id={formData.id}
                                endpoint='production'
                                elementName={`Production entry for ${recipeName}`}
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


        </div>

    )
}

export default ProductionForm;