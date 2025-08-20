import {type IRecipeLabour} from '../../models/IRecipeLabour';
import {type IGenericFormProps} from "../../models/IFormProps";
import {useFormLogic} from "../../hooks/useFormLogic";
import DeleteElement from '../Utility/DeleteElement.tsx';
import {useData} from "../../contexts/DataContext.tsx";
import React, {useEffect, useState} from "react";

const RecipeLabourForm = (props: IGenericFormProps<IRecipeLabour>) => {
    const {formData, isSaving, onDelete} = props;

    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit

    } = useFormLogic({...props, primaryKeyName: 'id'});

    // Assumes your DataContext provides these lists
    const {labourers, labourCategories} = useData();

    const uniqueId = formData.id;
    // The description is now used for the delete confirmation, not as a title
    const taskDescription = formData.description || 'this task';

    const [displayLabourMinutes, setDisplayLabourMinutes] = useState('');  // local state var to handle the parsed value for display-only purposes (hides trailing zeros)

    // Sync the prop value to the local display state when it changes
    useEffect(() => {
        const value = formData.labour_minutes;
        if (value !== null && value !== undefined) {
            // Format the incoming value by parsing it and converting back to a string.
            const formatted = parseFloat(String(value)).toString();
            setDisplayLabourMinutes(formatted);
        } else {
            // Handle null or undefined cases
            setDisplayLabourMinutes('');
        }
    }, [formData.labour_minutes]);


    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // update the local display var for qty
        setDisplayLabourMinutes(e.target.value);
    };

// 4. Use onBlur to commit the change to the parent state
    const handleBlurAndCommit = (e: React.FocusEvent<HTMLInputElement>) => {
        // Before calling the parent's handleEdit callback, parse the local state
        const numericValue = parseFloat(displayLabourMinutes);

        // Also parse the original value to ensure a correct comparison to check if change has occurred and needs to be persisted to DB
        const originalNumericValue = formData.labour_minutes !== null && formData.labour_minutes !== undefined
            ? parseFloat(String(formData.labour_minutes))
            : null;

        if (!isNaN(numericValue)) {
            setDisplayLabourMinutes(numericValue.toString());
        } else if (originalNumericValue !== null) {
            // If the user entered invalid text, revert to the original value
            setDisplayLabourMinutes(originalNumericValue.toString());
        }

        // Check the event target's value matches the final numeric value before passing it to the parent handler.
        e.target.value = isNaN(numericValue) ? '' : String(numericValue);

        // Only call the expensive parent handleEdit API callback if the value has actually changed
        if (numericValue !== originalNumericValue) {
            handleEdit(e);
        }
    };


    return (
        <div className="box recipe-labour p-4 mb-4">
            <div className="columns">

                {/* --- LEFT COLUMN (2/3 width) --- */}
                <div className="column is-two-thirds">

                    <div className="field is-horizontal">
                        <div className="field-body">
                            {/* Labourer Dropdown */}
                            <div className="field" style={{flexGrow: 2}}>
                                <label className="label is-small" htmlFor={`labourer_id_${uniqueId}`}>Labourer</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id={`labourer_id_${uniqueId}`}
                                            name="labourer_id"
                                            value={formData.labourer_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select labourer...</option>
                                            {(labourers || []).map((labourer) => (
                                                <option key={labourer.id} value={labourer.id}>
                                                    {labourer.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Labour Minutes Input */}
                            <div className="field">
                                <label className="label is-small" htmlFor={`labour_minutes_${uniqueId}`}>Minutes</label>
                                <div className="control">
                                    <input
                                        ref={focusInputRef}
                                        id={`quantity_${uniqueId}`}
                                        className="input"
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 25"
                                        name="quantity"
                                        // The input is controlled by local string state to allow for parsing the actual value to display a decimal without trailing zeroes
                                        value={displayLabourMinutes}
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
                        </div>
                    </div>

                    {/* --- TOP LEFT: Category Dropdown (styled as title) + Delete Button --- */}
                    <div className="level is-mobile mb-2">
                        <div className="level-left">
                            <div className="level-item" style={{flexGrow: 1}}>
                                <div className="field">
                                    <label className="label is-small"
                                           htmlFor={`labour_category_id_${uniqueId}`}>Category</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select

                                                id={`labour_category_id_${uniqueId}`}
                                                name="labour_category_id"
                                                className="has-text-weight-semibold" // Makes text bold for title effect
                                                value={formData.labour_category_id ?? 0}
                                                onChange={handleChange}
                                                onBlur={handleEdit}
                                                onFocus={handleFocus}
                                                disabled={isSaving}
                                                required
                                            >
                                                <option value={0} disabled>Select category...</option>
                                                {(labourCategories || []).map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                {!isNew && (
                                    <DeleteElement
                                        element_id={formData.id}
                                        endpoint={`recipe_labour`}
                                        elementName={taskDescription}
                                        onDelete={onDelete}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- BOTTOM LEFT: Labourer and Minutes side-by-side --- */}

                </div>

                {/* --- RIGHT COLUMN (1/3 width) --- */}
                <div className="column is-one-third">
                    <div className="field">
                        <label className="label is-small" htmlFor={`description_${uniqueId}`}>Task Description</label>
                        <div className="control">
                            <textarea
                                id={`description_${uniqueId}`}
                                className="textarea"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                onBlur={handleEdit}
                                onFocus={handleFocus}
                                disabled={isSaving}
                                placeholder="Describe the task..."
                                rows={5} // Increased rows to better fill the column height
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeLabourForm;