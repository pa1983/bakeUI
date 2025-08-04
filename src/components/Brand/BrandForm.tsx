import React, {useState} from 'react';
import {type Brand} from '../../models/brand.ts';
import useFlash from "../../contexts/FlashContext.tsx";
import {patchField} from "../../services/commonService.ts";
import {useAuth} from "react-oidc-context";

// Props for our component
interface BrandFormProps {
    formData: Brand;
    onSave: (updatedBrand: Brand) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onEdit: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isSaving: boolean;
}


const BrandForm = ({formData, onSave, onChange, onCancel, onEdit, onFocus, isSaving}: BrandFormProps) => {
    // Use local state to manage form data, initialized with the prop



    // Handle form submission - button hidden if ID exists and handle blur takes care of saving individual field changes
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };


    return (

        //
        <form onSubmit={handleSubmit}>
            {/* Brand Name Input */}
            <div className="field">
                <label className="label" htmlFor="brand_name">Brand Name</label>
                <div className="control">
                    <input
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

            {/* Date Added (Read-Only) - This one does not need a name attribute */}
            <div className="field">
                <label className="label" htmlFor="added_date">Date Added</label>
                <div className="control">
                    <input
                        id="added_date"
                        className="input is-static"
                        type="text"
                        value={formData.added_date ? new Date(formData.added_date).toLocaleDateString() : 'Will be set upon creation'}
                        readOnly
                    />
                </div>
            </div>


                {/*todo - add an image uploader component to associate an image with the item.  Could the component also display a primary image?  Feed it an image Id or a url?  Image ID would be easier, but would require more api calls*/}
                {/*<div className="field">*/}
                {/*    <label className="label" htmlFor="image_url">Image URL</label>*/}
                {/*    <div className="control">*/}
                {/*        <input*/}
                {/*            id="image_url"*/}
                {/*            name="image_url"*/}
                {/*            className="input"*/}
                {/*            type="url"*/}
                {/*            placeholder="https://example.com/image.png"*/}
                {/*            value={formData.image_url || ''}*/}
                {/*            onChange={handleChange}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Action Buttons */}


                {/*conditionally display a save new button.  if not a new entry, changes will be saved each time a field is blurred */}
                <div className="field is-grouped">
                    {formData.brand_id === 0 ? (
                        // Case for a NEW brand (ID is 0)
                        <>
                            <div className="control">
                                <button type="submit" className="button is-primary">
                                    Create Brand
                                </button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-light" onClick={onCancel}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        // Case for an EXISTING brand (ID is not 0)
                        <div className="control">
                            <p className="is-italic has-text-grey">Changes are saved automatically.</p>
                        </div>
                    )}
                </div>
        </form>
    );
};

export default BrandForm;