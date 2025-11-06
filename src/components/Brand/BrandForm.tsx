import React, {useCallback, useEffect, useRef} from 'react';
import {type IBrand} from '../../models/IBrand.ts';
import {useShortcut} from "../../contexts/KeyboardShortcutContext.tsx";
import DeleteElement from "../Utility/DeleteElement.tsx";


interface BrandFormProps {
    formData: IBrand;
    onSave: (updatedBrand: IBrand) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onEdit: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isSaving: boolean;
    onDelete: () => void;
    isModal: boolean;
}


const BrandForm = ({
                       formData,
                       onSave,
                       onChange,
                       onCancel,
                       onEdit,
                       onFocus,
                       isSaving,
                       onDelete,
                       isModal = false

                   }: BrandFormProps) => {

    const isNew = formData.brand_id === 0;
    // SET FOCUS ELEMENT
    //create a ref for the input element to be focussed on first render
    const focusInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // On first render, focus on the element with ref = focusInputRef
        focusInputRef.current?.focus();
    }, []);
    //

    /** handle save - decoupled from handle submit, for use both in submit button click and keyboard shortcut
     *
     */
    const handleSave = useCallback(() => {
        console.log('handleSave triggered');
        onSave(formData);
    }, [formData, onSave]);

    // The form's submit handler, which prevents default browser behaviour.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };


    // Conditionally set the shortcut's function only when creating a new brand and not inside a modal - don't want to trigger a handleSave event
    // as hooks cannot be called condiitonally in react, the conditional logic must be inside the hook configuration, rather than in an if statement around it

    useShortcut('Enter', (isNew && !isModal) ? handleSave : null, {ctrl: true});

    return (
        <form onSubmit={handleSubmit}>
            {/* Brand Name Input */}
            <div className="field">
                <label className="label" htmlFor="brand_name">Brand Name</label>
                <div className="control">
                    <input
                        ref={focusInputRef}// set the focus ref
                        id="brand_name"
                        className="input"
                        type="text"
                        placeholder="e.g., Neill's"
                        name="brand_name"
                        value={formData.brand_name || ''}
                        onChange={onChange}
                        onBlur={onEdit}
                        onFocus={onFocus}
                        disabled={isSaving}
                        required
                    />
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
                        onChange={onChange}
                        onBlur={onEdit}
                        onFocus={onFocus}
                        disabled={isSaving}
                    />
                </div>
            </div>

            {/* Date Added (Read-Only) */}
            <div className="field">
                <label className="label" htmlFor="added_date">Date Added</label>
                <div className="control">
                    <input
                        id="added_date"
                        className="input is-static"
                        type="text"
                        value={
                            formData.added_date ?
                                new Date(formData.added_date).toLocaleDateString() :
                                'Will be set upon creation'}
                        readOnly
                    />
                </div>
            </div>

            <div className="field is-grouped">
                {isNew ? (
                    // Case for a NEW brand
                    <>
                        <div className="control">
                            <button
                                type="submit"
                                className={`button is-primary ${isSaving ? 'is-loading' : ''}`}
                                disabled={isSaving}
                            >
                                {/*can't have a shortcut in the modal or it'll interfere with the parent form's shortcuts */}
                                {isModal ? 'Create Brand' : 'Create Brand (CTRL+Enter)'}
                            </button>
                        </div>
                        <div className="control">
                            <button type="button" className="button is-light" onClick={onCancel} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (

                    // Case for an EXISTING brand
                    <>
                        <div className="control">
                            <p className="is-italic bake-subtitle-subtle">Changes are saved automatically.</p>
                        </div>

                        <DeleteElement
                            element_id={formData.brand_id}
                            endpoint='buyable/brand'
                            elementName={formData.brand_name}
                            onDelete={onDelete}
                        />
                    </>
                )}
            </div>


        </form>
    )
        ;
};

export default BrandForm;