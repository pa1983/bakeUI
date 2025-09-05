import type {IGenericFormProps} from "../../models/IFormProps.ts";
import type {IIngredient} from "../../models/IIngredient.ts";
import {useFormLogic} from "../../hooks/useFormLogic.ts";
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";
import DeleteElement from '../Utility/DeleteElement.tsx';
import IngredientBuyablesList from "../IngredientBuyable/IngredientBuyablesList.tsx";
import ImageMaster from "../Image/ImageMaster.tsx";


const IngredientForm = (props: IGenericFormProps<IIngredient>) => {
    const {formData, onCancel, isSaving, onDelete}= props;

    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit,
        handleSubmit,
    } = useFormLogic({...props, primaryKeyName: 'ingredient_id'});

    const {units} = useUnitOfMeasures();

    // todo - need to add handler callbacks here for the picker function for adding new buyables to an ingredient
    // also consider altering the api response and ingredients interface to bring in a nest list of attached buyables
// OR just have a separate function attached to the ingredient form to show a list of attached buyables, using ingredient ID as a prop

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Ingredient Name Input */}
                <div className="field">
                    <label className="label" htmlFor="ingredient_name">Ingredient Name</label>
                    <div className="control">
                        <input
                            ref={focusInputRef}
                            id="ingredient_name"
                            className="input"
                            type="text"
                            placeholder="e.g., Plain Flour, Caster Sugar"
                            name="ingredient_name"
                            value={formData.ingredient_name || ''}
                            onChange={handleChange}
                            onBlur={handleEdit}
                            onFocus={handleFocus}
                            disabled={isSaving}
                            required
                        />
                    </div>
                </div>

                {/* UOM and Density */}
                <div className="field is-horizontal">
                    <div className="field-body">
                        <div className="field">
                            <label className="label" htmlFor="standard_uom_id">Standard Unit</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        id="standard_uom_id"
                                        name="standard_uom_id"
                                        value={formData.standard_uom_id ?? 0}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    >
                                        <option value={0} disabled>Select a base unit...</option>
                                        {units.map((uom) => (
                                            <option key={uom.uom_id} value={uom.uom_id}>
                                                {uom.name} ({uom.abbreviation})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="help">The base unit for this ingredient (e.g., kg, L, each).</p>
                        </div>
                        <div className="field">
                            {/*todo - check g/ml is correct expected unit for density - suspect this is wrong*/}
                            <label className="label" htmlFor="density">Density (g/mL)</label>
                            <div className="control">
                                <input
                                    id="density"
                                    className="input"
                                    type="number"
                                    step="any"
                                    placeholder="e.g., 0.92 (optional)"
                                    name="density"
                                    value={formData.density || ''}
                                    onChange={handleChange}
                                    onBlur={handleEdit}
                                    onFocus={handleFocus}
                                    disabled={isSaving}
                                />
                            </div>
                            <p className="help">Used for converting between weight and volume.</p>
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
                        placeholder="Allergens, brand preferences, or other notes..."
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

                <div className="field is-grouped mt-5">
                    {isNew ? (
                        <>
                            <div className="control">
                                <button
                                    type="submit"
                                    className={`button is-primary ${isSaving ? 'is-loading' : ''}`}
                                    disabled={isSaving}
                                >
                                    Create Ingredient (CTRL+Enter)
                                </button>
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
                                element_id={formData.ingredient_id}
                                endpoint='ingredient'
                                elementName={formData.ingredient_name}
                                onDelete={onDelete}
                            />
                        </>
                    )}
                </div>
            </form>
            <hr></hr>
            {/* can't link buyables or images in a new form - needs to save first to get an ID from database to which links can be made */}
            {formData.ingredient_id !== 0 &&
                (<>
                    <IngredientBuyablesList ingredient_id={formData.ingredient_id}/>

                    {/*todo - add a wrapper on image master to include the formatting of the endpoints? */}
                    <ImageMaster
                        title='Ingredient Images'
                        getEndpoint={`/ingredient_image/all?ingredient_id=${formData.ingredient_id}`}
                        postEndpoint={`/ingredient/${formData.ingredient_id}/image/upload`}

                    />
                </>)

            }
            {/*     todo - onSuccess - refresh
        onDelete - fire delete of image and refresh  */}
        </>
    );
};
export default IngredientForm;