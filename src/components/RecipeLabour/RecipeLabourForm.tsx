import React from 'react';
import { type IRecipeLabour } from '../../models/IRecipeLabour';
import { type IGenericFormProps } from "../../models/IFormProps";
import { useFormLogic } from "../../hooks/useFormLogic";
import DeleteElement from '../Utility/DeleteElement.tsx';
import { useData } from "../../contexts/DataContext.tsx";

const RecipeLabourForm = (props: IGenericFormProps<IRecipeLabour>) => {
    const { formData, onSave, onChange, onEdit, onCancel, isSaving, onDelete, isModal = false } = props;

    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit,
        handleSubmit,  // never used here as the form cannot be created from new by the user - it's system generated when a user selected an item from the ADD ELEMENT list

    } = useFormLogic({ ...props, primaryKeyName: 'id' });

    // Assumes your DataContext provides these lists
    const { labourers, labourCategories } = useData();

    const uniqueId = formData.id;
    // The description is now used for the delete confirmation, not as a title
    const taskDescription = formData.description || 'this task';

    return (
        <div className="box recipe-labour p-4 mb-4">
            <div className="columns">

                {/* --- LEFT COLUMN (2/3 width) --- */}
                <div className="column is-two-thirds">

                    <div className="field is-horizontal">
                        <div className="field-body">
                            {/* Labourer Dropdown */}
                            <div className="field" style={{ flexGrow: 2 }}>
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
                                        id={`labour_minutes_${uniqueId}`}
                                        ref={focusInputRef}
                                        className="input"
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 15"
                                        name="labour_minutes"
                                        value={parseFloat(formData.labour_minutes) || ''}
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

                    {/* --- TOP LEFT: Category Dropdown (styled as title) + Delete Button --- */}
                    <div className="level is-mobile mb-2">
                        <div className="level-left">
                            <div className="level-item" style={{ flexGrow: 1 }}>
                                <div className="field">
                                    <label className="label is-small" htmlFor={`labour_category_id_${uniqueId}`}>Category</label>
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
                                        isSmall={true}
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