import {useState} from 'react';
import {type IRecipe} from '../../models/IRecipe'; // Adjust path
import {type IGenericFormProps} from "../../models/IFormProps";
import {useFormLogic} from "../../hooks/useFormLogic";
import DeleteElement from '../Utility/DeleteElement.tsx';
import {useData} from "../../contexts/DataContext.tsx";
import {useUnitOfMeasures} from "../../contexts/UnitOfMeasureContext.tsx";

const RecipeForm = (props: IGenericFormProps<IRecipe>) => {
    const {formData, onCancel, isSaving, onDelete} = props;

    // Generic form logic hook
    const {
        isNew,
        focusInputRef,
        handleFocus,
        handleChange,
        handleEdit,
        handleSubmit,
    } = useFormLogic({...props, primaryKeyName: 'recipe_id'});

    // Data sources from contexts ---
    const {recipeTypes, productTypes, recipeStatuses} = useData();
    const {units} = useUnitOfMeasures();

    // handle toggling full form view
    const [isExpanded, setIsExpanded] = useState(isNew);

    const toggleDetails = () => {
        setIsExpanded(prev => !prev);
    };

    return (

        <form onSubmit={handleSubmit}>
            {/* Recipe Name */}
            <div className="field">
                <label className="label" htmlFor="recipe_name">Recipe Name</label>
                <div className="control">
                    <input
                        ref={focusInputRef}
                        id="recipe_name"
                        className="input"
                        type="text"
                        placeholder="e.g., Sourdough Loaf"
                        name="recipe_name"
                        value={formData.recipe_name || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>


            {/* --- toggle button --- */}
            <div className="field">
                <div className="control">
                    <button type="button" className="button is-small is-primary" onClick={toggleDetails}>
                        <span className="icon is-small">
                           {/* Assumes you have Font Awesome loaded, which is common with Bulma */}
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </span>
                        <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
                    </button>
                </div>
            </div>

            {/* --- 3. Conditionally render the rest of the form details --- */}
            {isExpanded && (
                <>

                    {/* Recipe Description */}
                    <div className="field">
                        <label className="label" htmlFor="recipe_description">Description</label>
                        <div className="control">
                    <textarea
                        id="recipe_description"
                        className="textarea"
                        placeholder="A brief description of the recipe"
                        name="recipe_description"
                        value={formData.recipe_description || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                    />
                        </div>
                    </div>

                    {/* Dropdowns for Recipe Type and Product Type */}
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <label className="label" htmlFor="recipe_type_id">Recipe Type</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id="recipe_type_id"
                                            name="recipe_type_id"
                                            value={formData.recipe_type_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select a type...</option>
                                            {(recipeTypes || []).map((type) => (
                                                <option key={type.recipe_type_id} value={type.recipe_type_id}>
                                                    {type.recipe_type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="product_type_id">Product Type</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id="product_type_id"
                                            name="product_type_id"
                                            value={formData.product_type_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select a type...</option>
                                            {(productTypes || []).map((type) => (
                                                <option key={type.product_type_id} value={type.product_type_id}>
                                                    {type.product_type_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="recipe_status_id">Status</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id="recipe_status_id"
                                            name="recipe_status_id"
                                            value={formData.recipe_status_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select a status...</option>
                                            {(recipeStatuses || []).map((status) => (
                                                <option key={status.recipe_status_id} value={status.recipe_status_id}>
                                                    {status.recipe_status_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Recipe Quantity and Yield */}
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <label className="label" htmlFor="recipe_quantity">Recipe Quantity</label>
                                <div className="control">
                                    <input
                                        id="recipe_quantity"
                                        className="input"
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 950"
                                        name="recipe_quantity"
                                        value={formData.recipe_quantity || ''}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" htmlFor="recipe_uom_id">Recipe Unit</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            id="recipe_uom_id"
                                            name="recipe_uom_id"
                                            value={formData.recipe_uom_id ?? 0}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            onFocus={handleFocus}
                                            disabled={isSaving}
                                            required
                                        >
                                            <option value={0} disabled>Select a base unit...</option>
                                            {(units || []).map((uom) => (
                                                <option key={uom.uom_id} value={uom.uom_id}>
                                                    {uom.name} ({uom.abbreviation})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* not currently using this - comment out, but leave to allow for easy readdition when ready to use in queries */}
                            {/*<div className="field">*/}
                            {/*    <label className="label" htmlFor="yield_percentage">Yield %</label>*/}
                            {/*    <div className="control">*/}
                            {/*        <input*/}
                            {/*            id="yield_percentage"*/}
                            {/*            className="input"*/}
                            {/*            type="number"*/}
                            {/*            step="any"*/}
                            {/*            placeholder="100"*/}
                            {/*            name="yield_percentage"*/}
                            {/*            value={formData.yield_percentage || ''}*/}
                            {/*            onChange={handleChange}*/}
                            {/*            onBlur={handleEdit}*/}
                            {/*            onFocus={handleFocus}*/}
                            {/*            disabled={isSaving}*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    {/* Version and Is Current */}
                    {/* Notes Textarea */}
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <label className="label" htmlFor="notes">Notes</label>
                                <div className="control">
                    <textarea
                        id="notes"
                        className="textarea"
                        placeholder="General notes about the recipe..."
                        name="notes"
                        rows={2}
                        value={formData.notes || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field is-4">
                                <label className="label" htmlFor="version">Version</label>
                                <div className="control">
                                    <input
                                        id="version"
                                        className="input"
                                        type="number"
                                        name="version"
                                        value={formData.version || ''}
                                        onChange={handleChange}
                                        onBlur={handleEdit}
                                        onFocus={handleFocus}
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field is-flex is-align-items-flex-end">
                                <div className="control is-2">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            name="is_current"
                                            checked={formData.is_current}
                                            onChange={handleChange}
                                            onBlur={handleEdit}
                                            disabled={isSaving}
                                        />
                                        {' '}Is Current Version
                                    </label>
                                </div>
                            </div>

                            <div className="field is-6">
                                <label className="label" htmlFor="version_notes">Version Notes</label>
                                <div className="control">
                            <textarea
                                id="version_notes"
                                className="textarea"
                                placeholder="Specific notes for this version..."
                                name="version_notes"
                                rows={2}
                                value={formData.version_notes || ''}
                                onChange={handleChange}
                                onBlur={handleEdit}
                                onFocus={handleFocus}
                                disabled={isSaving}
                            />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Version Notes Textarea */}

                    <div className="field is-grouped mt-5">
                    {/* Timestamps (Read-Only) */}
                    {!isNew && (
                        <div className="field">
                            <label className="label">Timestamps</label>
                            <p className="is-size-7 has-text-grey">
                                Created: {formData.created_timestamp ? new Date(formData.created_timestamp).toLocaleString() : 'N/A'}
                                <br/>
                                Modified: {formData.modified_timestamp ? new Date(formData.modified_timestamp).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}

                        {isNew ? (
                            <>
                                <div className="control">
                                    <button
                                        type="submit"
                                        className={`button is-primary ${isSaving ? 'is-loading' : ''}`}
                                        disabled={isSaving}
                                    >
                                        Create Recipe (CTRL+Enter)
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
                                <div className="control">
                                    <DeleteElement
                                        element_id={formData.recipe_id}
                                        endpoint='recipe' // API endpoint for recipes
                                        elementName={formData.recipe_name}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

        </form>
    );
};

export default RecipeForm;