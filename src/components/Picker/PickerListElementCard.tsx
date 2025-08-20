import React, {useCallback} from 'react';
import imageNotFound from '../../assets/Image-not-found.png'
import type {IPickerElement} from "../../models/picker.ts";  // todo - replace this with a logo or plain colour so that no image doesn't look like missing data

export interface PickerElementProp extends IPickerElement {
    onSelect: (id: number) => void,
    onClose: () => void
}

/**
 * Simple list element for use within picker
 * Will be reused for all 3 different types.
 * @param imageUrl
 * @param title
 * @param subtitle
 * @param id
 * @param onSelect
 * @param onClose
 * @constructor
 */


const PickerListElementCard = ({imageUrl, title, subtitle, id, onSelect, onClose}: PickerElementProp) => {

    const handleClick = useCallback(() => {
            onSelect(id);  // should apply the id value to the grandparent's formdata for the field, or trigger a navigate redirect to the edit form
            onClose();  // if the picker is called in a modal ,just closes down the modal, otherwise run custom onClose function
        }, [id, onClose, onSelect]
    )


    const imageSource = imageUrl || imageNotFound  // defaults in a placeholder image if no image is present; helps preserve formatting and makes it clear to user that image has not been uploaded
    return (
        <div className="box mb-6" onClick={handleClick}>
            <div className="columns is-vcentered">
                {/* Image Section */}
                {/* if an image is passed in, use it to display a thumbnail, otherwise render nothing and allow the title-subtitle to fill the whole card width */}
                {!imageUrl ? null : (

                    <div className="column">
                        <figure className="image is-1by1" style={{maxWidth: '256px'}}>
                            <img
                                key={id}
                                src={imageSource}
                                alt={title}
                                className="is-rounded"
                                style={{objectFit: 'cover'}}
                                // Fallback for image loading errors
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.onerror = null; // Prevents infinite loop
                                    e.currentTarget.src = imageNotFound;
                                }}
                            />
                        </figure>
                    </div>

                )}

                {/* Text Content */}
                <div className="column has-text-centered-mobile has-text-left-tablet">
                    <h2 className="title is-6">
                        {title}
                    </h2>
                    {!subtitle ? null : (
                        <p className="is-7">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PickerListElementCard;