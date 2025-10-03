import React, {useEffect, useMemo, useState} from 'react';
import {type IRecipeIngredient} from '../../models/IRecipeIngredient';
import {type IGenericFormProps} from "../../models/IFormProps";
import {useFormLogic} from "../../hooks/useFormLogic";
import DeleteElement from '../Utility/DeleteElement.tsx';
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";
import {useData} from "../../contexts/DataContext.tsx";
import ReviewItemCard from "../Recipe/ReviewItemCard.tsx";

const RecipeIngredientForm = (props: IGenericFormProps<IRecipeIngredient>) => {
    const {formData, isSaving, onDelete, aiAnalysis} = props;

    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit,
    } = useFormLogic({...props, primaryKeyName: 'id'});


    const {ingredients} = useData();
    const {units} = useUnitOfMeasures();
    const ingredientName = (ingredients || []).find(ing => ing.ingredient_id === formData.ingredient_id)?.ingredient_name || 'Loading...';
    const uniqueId = formData.id;

    const [displayQuantity, setDisplayQuantity] = useState('');  // local state var to handle the parsed value for display-only purposes (hides trailing zeros)


    // Find the relevant AI analysis for this specific ingredient
    const relevantAnalysis = useMemo(() => {
        if (!aiAnalysis || !aiAnalysis.items_for_review) {
            return null;
        }
        //aiAnalysis?.items_for_review?.[0].comment}
        return aiAnalysis.items_for_review.find(item =>
            item.cost_type.toLowerCase().replace("-", "") === 'ingredient' && item.item_id === formData.id
        );
    }, [aiAnalysis, formData.id]);

    // Sync the prop value to the local display state when it changes
    useEffect(() => {
        const value = formData.quantity;
        if (value !== null && value !== undefined) {
            // Format the incoming value by parsing it and converting back to a string.
            const formatted = parseFloat(String(value)).toString();
            setDisplayQuantity(formatted);
        } else {
            // Handle null or undefined cases
            setDisplayQuantity('');
        }
    }, [formData.quantity]);


    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // update the local display var for qty
        setDisplayQuantity(e.target.value);
    };

    const handleBlurAndCommit = (e: React.FocusEvent<HTMLInputElement>) => {
        // Before calling the parent's handleEdit callback, parse the local state
        const numericValue = parseFloat(displayQuantity);

        // ... the original value to ensure a correct comparison to check if change has occurred and needs to be persisted to DB. Without parse,
        // comparison of differnt types will cause unnecessary patch calls
        const originalNumericValue = formData.quantity !== null && formData.quantity !== undefined
            ? parseFloat(String(formData.quantity))
            : null;
        console.log(originalNumericValue);
        if (!isNaN(numericValue)) {
            setDisplayQuantity(numericValue.toString());
        } else if (originalNumericValue !== null) {
            // If the user entered invalid text, revert to the original value
            setDisplayQuantity(originalNumericValue.toString());
        }
        // Check the event target's value matches the final numeric value before passing it to the parent handler.
        e.target.value = isNaN(numericValue) ? '' : String(numericValue);

        // Only call the expensive parent handleEdit API callback if the value has actually changed
        if (numericValue !== originalNumericValue) {
            console.log("triggered the handleEdit callback with event data: ");
            console.log(e);
            handleEdit(e);
        }
    };


    return (
        <div className="box is-light p-4 mb-4 recipe-ingredient">
            <div className="columns is-vcentered">

                <div className="column is-two-thirds">
                    <div className="level is-mobile mb-2">
                        <div className="level-left">
                            <div className="level-item">
                                <a
                                    className="button  is-small"
                                    href={`/ingredient/${formData.ingredient_id}`} target="_blank"
                                >
                                    <p className="title is-6 has-text-weight-semibold">{ingredientName}&nbsp;</p>
                                    <i className="fa-solid fa-up-right-from-square"></i>
                                </a>


                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                {!isNew && (
                                    <DeleteElement
                                        element_id={uniqueId}
                                        endpoint={`recipe_ingredient`}
                                        elementName={ingredientName}
                                        onDelete={onDelete}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-body">

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
                                        // The input is controlled by local string state to allow for parsing the actual value to display a decimal without trailing zeroes
                                        value={displayQuantity}
                                        // onChange updates the LOCAL string state
                                        onChange={handleLocalChange}
                                        // onBlur commits the actual numeric value to the parent state
                                        onBlur={handleBlurAndCommit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field" style={{flexGrow: 2}}>
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
                                                    {uom.abbreviation || uom.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {relevantAnalysis && (
                <div>
                    <ReviewItemCard
                        itemForReview={relevantAnalysis}/>
                </div>
            )}
        </div>
    );
};

export default RecipeIngredientForm;