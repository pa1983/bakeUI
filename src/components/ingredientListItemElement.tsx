import React from 'react';
import imageNotFound from '.././assets/image-not-found.png'
// Define the types for the props of ImageTextCard
interface RecipeElementCardProps {
    imageUrl: string|null;
    title: string;
    subtitle: string;
    linkTo: string
    // todo - may want some sort of identifier here, poss an enum, to define the TYPE of element - ingredient, precursor, equipment or labour
}

/**
 * Simple list element for use within recipes when searching for elements to add (ingredients, labour, equipment)
 * Will be reused for all 3 different types.
 * @param imageUrl
 * @param title
 * @param subtitle
 * @constructor
 */
const ListElementCard = ({ imageUrl, title, subtitle, linkTo }: RecipeElementCardProps) => {
    const imageSource = imageUrl || imageNotFound  // defaults in a placeholder image if no image is present; helps presever formatting and makes it clear to user that image has not been uploaded
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-6 mb-8 transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl">
            {/* Image Section */}
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 w-full md:w-auto">
                <a href={linkTo}>
                <img
                    src={imageSource}
                    alt={title}
                    className="rounded-lg object-cover w-full h-48 md:h-full max-w-xs md:max-w-none md:max-h-48 shadow-md"
                    // Fallback for image loading errors
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null; // Prevents infinite loop
                        e.currentTarget.src = imageNotFound;
                    }}
                />
                </a>
            </div>

            {/* Text Content Section */}
            <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
                    {title}
                </h2>
                <p className="text-lg md:text-xl text-gray-600">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default ListElementCard;