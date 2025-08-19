import React from 'react';

import {type IRecipeSubRecipe} from "../../models/IRecipeSubRecipe.ts";
import { type IGenericFormProps } from "../../models/IFormProps";
import { useFormLogic } from "../../hooks/useFormLogic";
import DeleteElement from '../Utility/DeleteElement.tsx';
import { useUnitOfMeasures } from "../../contexts/UnitOfMeasureContext.tsx";
import { useData } from "../../contexts/DataContext.tsx";

const RecipeSubRecipeForm = (props: IGenericFormProps<IRecipeSubRecipe>) => {
    const { formData, onSave, onChange, onEdit, onCancel, isSaving, onDelete, isModal = false } = props;

    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit,
    } = useFormLogic({ ...props, primaryKeyName: 'id' });

    const { units } = useUnitOfMeasures();
    const { recipes } = useData();  // Pull recipe data from context - will be used to fill in recipe elements in sub-recipe form using the recipe_id

    // In the recipe context data, look for the recipe matching the sub recipe ID from the formdata - this represents the recipe being used as a sub-recipe to the parent
    const SubRecipeName = (recipes || []).find(recipe => recipe.recipe_id === formData.sub_recipe_id)?.recipe_name || 'Loading...';

    const uniqueId = formData.id;


    return (
        <div className="box is-light p-4 mb-4 recipe-sub-recipe ">
            <div className="columns is-vcentered">

                {/* --- LEFT COLUMN (2/3 width) --- */}
                <div className="column is-two-thirds">
                    {/* --- Prominent Ingredient Name + Delete Button --- */}
                    <div className="level is-mobile mb-2">
                        <div className="level-left">
                            <div className="level-item">
                                <p className="title is-6 has-text-weight-semibold">{SubRecipeName}</p>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                {!isNew && (
                                    <DeleteElement
                                        element_id={formData.id}
                                        endpoint={`recipe_ingredient`}
                                        elementName={SubRecipeName}
                                        onDelete={onDelete}
                                        isSmall={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Qty and UOM side-by-side --- */}
                    <div className="field is-horizontal">
                        <div className="field-body">
                            {/* Quantity Input */}
                            <div className="field">
                                <label className="label is-small" htmlFor={`quantity_${uniqueId}`}>Quantity</label>
                                <div className="control">
                                    <input
                                        ref={focusInputRef}
                                        id={`quantity_${uniqueId}`}
                                        className="input"
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 500"
                                        name="quantity"
                                        value={parseFloat(formData.quantity) || ''}  // added parse float to convert string to number and trim off trailing zeros in decimals
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                            </div>
                            {/* Unit of Measure Dropdown */}
                            <div className="field" style={{ flexGrow: 2 }}>
                                <label className="label is-small" htmlFor={`uom_id_${uniqueId}`}>Unit</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id={`uom_id_${uniqueId}`}
                                            name="uom_id"
                                            value={formData.uom_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select unit...</option>
                                            {(units || []).map((uom) => (
                                                <option key={uom.uom_id} value={uom.uom_id}>
                                                    {uom.abbreviation || uom.uom_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (1/3 width) --- */}
                <div className="column is-one-third">
                    <div className="field">
                        <label className="label is-small" htmlFor={`notes_${uniqueId}`}>Notes</label>
                        <div className="control">
                            <textarea
                                id={`notes_${uniqueId}`}
                                className="textarea"
                                name="notes"
                                value={formData.notes || ''}
                                onChange={handleChange}
                                onBlur={handleEdit}
                                onFocus={handleFocus}
                                disabled={isSaving}
                                placeholder="Optional notes..."
                                rows={3} // Adjusted rows to better fit the column height
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeSubRecipeForm;