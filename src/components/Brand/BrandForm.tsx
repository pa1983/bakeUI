import React, {useCallback, useEffect, useRef} from 'react';
import {type Brand} from '../../models/brand.ts';
import {useShortcut} from "../../contexts/ShortcutContext.tsx";
import DeleteElement from "../Utility/DeleteElement.tsx";
import {useNavigate} from "react-router-dom";


interface BrandFormProps {
    formData: Brand;
    onSave: (updatedBrand: Brand) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onEdit: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isSaving: boolean;
    onDelete: ()=> void;
}


const BrandForm = ({
                       formData,
                       onSave,
                       onChange,
                       onCancel,
                       onEdit,
                       onFocus,
                       isSaving,
                        onDelete

                   }: BrandFormProps) => {

    const isNew = formData.brand_id === 0;
    const navigate = useNavigate();
    // SET FOCUS ELEMENT
    //create a ref for the input element to be focussed on first render
    const focusInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // On first render, focus on the element with ref = focusInputRef
        focusInputRef.current?.focus();
    }, []);
    //

    // handle save - decoupled from handle submit, for use both in submit button click and keyboard shortcut
    const handleSave = useCallback(() => {
        onSave(formData);
    }, [formData, onSave]);

    // The form's submit handler, which prevents default browser behavior.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };


    // Conditionally register the shortcut only when creating a new brand - don't want to trigger a handleSave event
    // if it's a form edit rather than create new
    useShortcut('Enter', isNew ? handleSave : null, {ctrl: true});


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

            {/* Action Buttons */}
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
                                Create Brand (CTRL+Enter)
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


                    // Case for an EXISTING brand
                    <>
                        <div className="control">
                            <p className="is-italic has-text-grey">Changes are saved automatically.</p>
                        </div>

                        <DeleteElement
                            element_id={formData.brand_id}
                            endpoint='buyable/brand'
                            elementName={formData.brand_name}
                            onDelete= {onDelete}
                        />
                    </>
                )}
            </div>


        </form>
    )
        ;
};

export default BrandForm;