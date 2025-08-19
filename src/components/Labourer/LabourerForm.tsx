import type {ILabourer} from "../../models/ILabourer.ts";
import {useFormLogic} from "../../hooks/useFormLogic.ts";
import React from "react";
import DeleteElement from "../Utility/DeleteElement.tsx";

const LabourerForm = (props: IGenericFormProps<ILabourer>) => {
    const {formData, onSave, onChange, onEdit, onCancel, isSaving, onDelete, isModal = false} = props;

    const {
        isNew,
        focusInputRef,
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

    // no picker definitions required in labourer form

    return (
        <form onSubmit={handleSubmit}>
            {/* Labourer type Name Input */}
            <div className="field">
                <label className="label" htmlFor="item_name">Labourer Type</label>
                <div className="control">
                    <input
                        ref={focusInputRef}
                        id="name"
                        className="input"
                        type="text"
                        placeholder="e.g., Head Baker, Trainee Barista ..."
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>

            {/* Description Textarea */}
            <div className="field">
                <label className="label" htmlFor="notes">Description</label>
                <div className="control">
                    <textarea
                        id="description"
                        className="textarea"
                        placeholder="Any relevant notes..."
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        onBlur={handleEdit}
                        onFocus={handleFocus}
                        disabled={isSaving}
                    />
                </div>
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

                                Create Labourer (CTRL+Enter)
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
                            element_id={formData.id}
                            endpoint='labourer'
                            elementName={formData.name}  // friendly name for the element being deleted
                            onDelete={onDelete}
                        />
                    </>
                )}
            </div>
        </form>
    )
}

export default LabourerForm;