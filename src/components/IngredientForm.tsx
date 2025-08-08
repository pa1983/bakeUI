import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios, { type AxiosResponse } from "axios";
import { useAuth } from "react-oidc-context";
import { useUnitOfMeasures } from "../contexts/UnitOfMeasureContext.tsx";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate


import type { IngredientRead, ImageRead } from '../models/ingredients.ts'; // Assuming you moved this to models/ingredient.ts
import { mapIngredientReadToFormData, type IngredientFormData } from "../utils/ingredientsUtils.tsx"; // Assuming you moved this to utils/ingredientUtils.ts


// If you intend to pass ingredient_id as a prop, define it here
interface IngredientFormProps {
    // This prop is optional and allows a parent to explicitly pass an ingredient ID
    // It will override the URL parameter if both are present.
    prop_ingredient_id?: string | number | null;
}
function IngredientForm({ prop_ingredient_id = null }: IngredientFormProps) {
    const auth = useAuth();
    let ingredient_id = null;
    // either get the ingredient ID as a prop from parent modal, or passed in as a query string parameter
    const { param_ingredient_id } = useParams();

    if (!prop_ingredient_id && param_ingredient_id) {
        ingredient_id = param_ingredient_id

    } else if (!param_ingredient_id && prop_ingredient_id) {
        ingredient_id = prop_ingredient_id
    }

    console.log(`Final ingredient ID: ${ingredient_id}. From props: ${prop_ingredient_id}.  from params: ${param_ingredient_id}`)

    const navigate = useNavigate(); // For redirecting after creation

    const { units: unitOfMeasureOptions, loading: uomLoading, error: uomError } = useUnitOfMeasures();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [ingredient, setIngredient] = useState<IngredientRead | null>(null);
    const [formData, setFormData] = useState<IngredientFormData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewIngredient, setIsNewIngredient] = useState<boolean>(false); // state to track if it's a new entry

    // Function to create a new ingredient
    const createIngredient = async (newData: IngredientFormData) => {
        try {
            if (!auth.user?.access_token) {
                setError("Authentication token not available. Please log in.");
                return false;
            }
            console.log('Attempting to create new ingredient:', newData);
            const headers = { Authorization: `Bearer ${auth.user.access_token}` };
            const res: AxiosResponse = await axios.post('http://localhost:8000/ingredient/', newData, {headers});
            console.log('New ingredient created:', res.data);
            // After successful creation, navigate to the edit page of the newly created ingredient
            navigate(`/ingredient/${res.data.data.ingredient_id}`);
            setIngredient(res.data.data); // Update local state with newly created ingredient
            setIsEditing(false); // Switch to view mode after creation
            return true;
        } catch (err: any) {
            console.error("Failed to create ingredient:", err);
            setError("Failed to create ingredient: " + (err.response?.data?.detail || err.message));
            return false;
        }
    };

    const updateIngredientData = async (updatedData: IngredientFormData | null) => {
        try {
            if (!auth.user?.access_token) {
                setError("Authentication token not available. Please log in.");
                return false;
            }
            if (!ingredient?.ingredient_id) {
                setError("Cannot update: Ingredient ID is missing.");
                return false;
            }
            console.log('Trying to push form data to API for update');
            const headers = { Authorization: `Bearer ${auth.user.access_token}` };

            const res: AxiosResponse = await axios.patch(`http://localhost:8000/ingredient/id/${ingredient.ingredient_id}`, updatedData, { headers });
            console.log('Result of attempting to update ingredient details:', res.data);
            // todo - error checking here - if response suggests doesn't exist or not authorised, redirect away to avoid endless loop
            setIngredient(res.data.data);
            setIsEditing(false);
            return res.data;
        } catch (err: any) {
            console.error("Failed to update ingredient:", err);
            setError("Failed to update ingredient: " + (err.response?.data?.detail || err.message));
            return false;
        }
    };

    const fetchIngredient = async (ing_id: number) => {
        setLoading(true);
        setError(null);
        try {
            if (!auth.isAuthenticated || !auth.user?.access_token) {
                console.error("Authentication token not available for fetch.");
                setError("Authentication token not available. Please log in.");
                setLoading(false);
                return;
            }

            console.log(`Trying to get ingredient ${ing_id}`);
            const headers = { Authorization: `Bearer ${auth.user.access_token}` };

            const response = await axios.get(`http://localhost:8000/ingredient/id/${ing_id}`, { headers });
            console.log(`Response data: `, response.data.data);
            const ingredientReadData: IngredientRead = response.data.data;
            setIngredient(ingredientReadData);
            setFormData(mapIngredientReadToFormData(ingredientReadData)); // Set form data immediately after fetch
        } catch (err: any) {
            console.error("Failed to fetch ingredient:", err);
            setError("Failed to load ingredient data. Please try again. " + (err.response?.data?.detail || err.message));
            setIngredient(null);
            setFormData(null);
        } finally {
            setLoading(false);
        }
    };

    // This useEffect handles initial loading logic (fetch existing or prepare new)
    useEffect(() => {
        console.log('Auth state changed or ingredient_id changed. isAuthenticated:', auth.isAuthenticated, 'isLoading:', auth.isLoading, 'ingredient_id:', ingredient_id);

        if (!auth.isLoading) { // Ensure authentication state has settled
            if (ingredient_id) { // We have an ingredient ID, so it's an existing ingredient
                setIsNewIngredient(false);
                if (auth.isAuthenticated) {
                    fetchIngredient(Number(ingredient_id));
                } else {
                    setError("Please log in to view ingredient details.");
                    setLoading(false);
                }
            } else { // No ingredient ID, so it's a new ingredient
                setIsNewIngredient(true);
                setIsEditing(true); // Always open new ingredient form in edit mode
                setLoading(false);
                setError(null); // Clear any previous errors

                // Initialize formData for a new ingredient with default values
                setFormData({
                    ingredient_name: '',
                    standard_uom_id: unitOfMeasureOptions.length > 0 ? unitOfMeasureOptions[0].uom_id : 1, // Default to first UOM or 1
                    density: null,
                    notes: ''
                });
                setIngredient(null); // Ensure no old ingredient data persists
            }
        }
    }, [auth.isAuthenticated, auth.isLoading, auth.user?.access_token, ingredient_id, unitOfMeasureOptions.length]); // Add unitOfMeasureOptions.length to dependency to ensure defaults are available


    // This useEffect correctly re-syncs formData whenever the 'ingredient' state changes for EXISTING ingredients.
    // For new ingredients, formData is set directly in the initial useEffect.
    useEffect(() => {
        if (ingredient && !isNewIngredient) { // Only update if ingredient data is available and it's not a new ingredient
            console.log('Ingredient data updated (for existing ingredient):', ingredient);
            setFormData(mapIngredientReadToFormData(ingredient));
        }
    }, [ingredient, isNewIngredient]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        if (isNewIngredient) {
            // If cancelling a new ingredient, navigate away (e.g., to the list page)
            navigate('/all');
        } else {
            setIsEditing(false);
            // Reset form data to the original ingredient state if it exists
            if (ingredient) {
                setFormData(mapIngredientReadToFormData(ingredient));
            } else {
                // Fallback for unexpected state where ingredient is null but it's not new
                setError("Cannot reset form: original ingredient data not found.");
            }
        }
    };

    const handleSaveClick = async () => {
        if (!formData) {
            setError("Form data is empty. Cannot save.");
            return;
        }

        if (isNewIngredient) {
            await createIngredient(formData);
        } else {
            await updateIngredientData(formData);
        }
        // No need to setIsEditing(false) here, as createIngredient/updateIngredientData will handle state changes/navigation.
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number | null = value;
        if (type === 'number') {
            parsedValue = value === '' ? null : parseFloat(value);
        } else if (name === 'standard_uom_id') {
            parsedValue = parseInt(value, 10);
        }

        setFormData((prev: IngredientFormData | null) => ({
            ...(prev || {}), // Ensure prev is not null
            [name]: parsedValue,
        }));
    };


    // --- KEYBOARD SHORTCUT EFFECT - CTRL+ENTER to save changes to ingredient ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed, AND Enter is pressed
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault(); // Prevent default action (e.g., new line in textarea)
                if (isEditing) { // Only trigger save if the form is currently in edit mode
                    handleSaveClick();
                }
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, handleSaveClick]); // Re-run effect if isEditing or handleSaveClick changes


    useEffect(() => {
        // opens edit more if CTRL+E is clicked.  Cancels if already in edit mode
        const shortcutEdit = (event: KeyboardEvent) => {
            // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed, AND Enter is pressed
            if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
                event.preventDefault(); // Prevent default action (e.g., new line in textarea)
                if (!isEditing) { // Only trigger save if the form is currently not in edit mode
                    handleEditClick();
                } else {
                    handleCancelClick()
                }
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener('keydown', shortcutEdit);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', shortcutEdit);
        };
    }, [isEditing, handleEditClick]); // Re-run effect if isEditing or handleSaveClick changes




    // Render loading or error states
    if (loading || uomLoading) { // Also consider UOM loading
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-gray-700">
                <p>Loading {loading ? 'ingredient data' : 'units of measure'}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-red-700">
                <p>{error}</p>
            </div>
        );
    }

    // Only proceed to render form if formData is available
    if (!formData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-gray-700">
                <p>No form data to display. This might indicate an error or an invalid ingredient ID.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isNewIngredient ? 'Create New Ingredient' : 'Ingredient Details'}
                    </h1>
                    {!isEditing ? (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
                            aria-label="Edit Ingredient"
                        >
                            <EditIcon style={{ fontSize: 20 }} />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSaveClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105"
                                aria-label="Save Changes"
                            >
                                <SaveIcon style={{ fontSize: 20 }} />
                                <span className="hidden sm:inline">Save</span>
                            </button>
                            <button
                                onClick={handleCancelClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                                aria-label="Cancel Editing"
                            >
                                <CancelIcon style={{ fontSize: 20 }} />
                                <span className="hidden sm:inline">Cancel</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                    {/* Ingredient Name */}
                    <div className="col-span-1">
                        <label htmlFor="ingredient_name" className="block text-sm font-medium text-gray-600 mb-1">Ingredient Name:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="ingredient_name"
                                name="ingredient_name"
                                value={formData.ingredient_name || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                                maxLength={50}
                            />
                        ) : (
                            <p className="text-lg">{ingredient?.ingredient_name || 'N/A'}</p>
                        )}
                    </div>

                    {/* Standard UOM */}
                    <div className="col-span-1">
                        <label htmlFor="standard_uom_id" className="block text-sm font-medium text-gray-600 mb-1">Standard Unit of Measure:</label>
                        {isEditing ? (
                            <select
                                id="standard_uom_id"
                                name="standard_uom_id"
                                value={formData.standard_uom_id || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                            >
                                <option value="">Select UOM</option>
                                {unitOfMeasureOptions.map(uom => (
                                    <option key={uom.uom_id} value={uom.uom_id}>
                                        {uom.name} ({uom.abbreviation})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-lg">
                                {ingredient?.standard_uom ? `${ingredient.standard_uom.name} (${ingredient.standard_uom.abbreviation})` : 'N/A'}
                            </p>
                        )}
                    </div>

                    {/* Density */}
                    <div className="col-span-1">
                        <label htmlFor="density" className="block text-sm font-medium text-gray-600 mb-1">Density:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                id="density"
                                name="density"
                                value={formData.density === null ? '' : formData.density}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                            />
                        ) : (
                            <p className="text-lg">{ingredient?.density !== null ? ingredient?.density : 'N/A'}</p>
                        )}
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1">Notes:</label>
                        {isEditing ? (
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes || ''}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                            ></textarea>
                        ) : (
                            <p className="text-lg whitespace-pre-wrap">{ingredient?.notes || 'N/A'}</p>
                        )}
                    </div>
                </div>

                {/* Images Section (only visible if not creating a new ingredient or if new and images can be added) */}
                {(!isNewIngredient && ingredient?.images && ingredient.images.length > 0) || isEditing ? (
                    <div className="mt-8 border-t pt-6 border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Images</h2>
                        {!isNewIngredient && ingredient?.images && ingredient.images.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {ingredient.images.map((img: ImageRead, index: number) => (
                                    <div key={img.image_id}
                                         className="flex flex-col items-center border border-gray-200 rounded-lg p-2 shadow-sm">
                                        <img
                                            src={img.image_url}
                                            alt={img.caption || `Image ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-md mb-2 border border-gray-300"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "https://placehold.co/150x150/E5E7EB/1F2937?text=Image+Error";
                                            }}
                                        />
                                        <p className="text-sm text-gray-600 text-center">{img.caption || img.alt_text || `Image ${index + 1}`}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !isEditing && <p className="text-gray-500">No images associated with this ingredient.</p>
                        )}
                        {isEditing && (
                            <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md text-blue-700">
                                <p>Image management functionality (add/remove/reorder) would be implemented here in edit mode.</p>
                            </div>
                        )}
                    </div>
                ) : null}


                {/* Footer for timestamps (only display if not a new ingredient) */}
                {!isNewIngredient && ingredient && (
                    <div
                        className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                        <p>Created: {new Date(ingredient.created_timestamp).toLocaleString()}</p>
                        <p>Last Modified: {new Date(ingredient.modified_timestamp).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
        // <section className="hero is-light is-fullheight">
        //     <div className="hero-body">
        //         <div className="container">
        //             <div className="columns is-centered">
        //                 <div className="column is-two-thirds-desktop">
        //                     <div className="box">
        //                         {/* Header */}
        //                         <div className="level is-mobile mb-5">
        //                             <div className="level-left">
        //                                 <h1 className="title is-4 has-text-grey-light">
        //                                     {isNewIngredient ? 'Create New Ingredient' : 'Ingredient Details'}
        //                                 </h1>
        //                             </div>
        //                             <div className="level-right">
        //                                 {!isEditing ? (
        //                                     <button onClick={handleEditClick} className="button is-link">
        //                                         <span className="icon"><EditIcon style={{ fontSize: 20 }}/></span>
        //                                         <span className="is-hidden-mobile">Edit</span>
        //                                     </button>
        //                                 ) : (
        //                                     <div className="buttons has-addons">
        //                                         <button onClick={handleSaveClick} className="button is-info">
        //                                             <span className="icon"><SaveIcon style={{ fontSize: 20 }}/></span>
        //                                             <span className="is-hidden-mobile">Save</span>
        //                                         </button>
        //                                         <button onClick={handleCancelClick} className="button is-danger is-light">
        //                                             <span className="icon"><CancelIcon style={{ fontSize: 20 }}/></span>
        //                                             <span className="is-hidden-mobile">Cancel</span>
        //                                         </button>
        //                                     </div>
        //                                 )}
        //                             </div>
        //                         </div>
        //
        //                         {/* Form Fields */}
        //                         <div className="columns is-multiline">
        //                             <div className="column is-half">
        //                                 <div className="field">
        //                                     <label htmlFor="ingredient_name" className="label">Ingredient Name:</label>
        //                                     <div className="control">
        //                                         {isEditing ? (
        //                                             <input type="text" id="ingredient_name" name="ingredient_name" value={formData.ingredient_name || ''} onChange={handleChange} className="input" maxLength={50} />
        //                                         ) : (
        //                                             <p className="is-size-5">{ingredient?.ingredient_name || 'N/A'}</p>
        //                                         )}
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="column is-half">
        //                                 <div className="field">
        //                                     <label htmlFor="standard_uom_id" className="label">Standard Unit of Measure:</label>
        //                                     <div className="control">
        //                                         {isEditing ? (
        //                                             <div className="select is-fullwidth">
        //                                                 <select id="standard_uom_id" name="standard_uom_id" value={formData.standard_uom_id || ''} onChange={handleChange}>
        //                                                     <option value="">Select UOM</option>
        //                                                     {/* map options here */}
        //                                                 </select>
        //                                             </div>
        //                                         ) : (
        //                                             <p className="is-size-5">{ingredient?.standard_uom ? `${ingredient.standard_uom.name} (${ingredient.standard_uom.abbreviation})` : 'N/A'}</p>
        //                                         )}
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="column is-half">
        //                                 <div className="field">
        //                                     <label htmlFor="density" className="label">Density:</label>
        //                                     <div className="control">
        //                                         {isEditing ? (
        //                                             <input type="number" id="density" name="density" value={formData.density === null ? '' : formData.density} onChange={handleChange} step="0.1" className="input" />
        //                                         ) : (
        //                                             <p className="is-size-5">{ingredient?.density !== null ? ingredient?.density : 'N/A'}</p>
        //                                         )}
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="column is-full">
        //                                 <div className="field">
        //                                     <label htmlFor="notes" className="label">Notes:</label>
        //                                     <div className="control">
        //                                         {isEditing ? (
        //                                             <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="textarea"></textarea>
        //                                         ) : (
        //                                             <p className="is-size-5" style={{ whiteSpace: 'pre-wrap' }}>{ingredient?.notes || 'N/A'}</p>
        //                                         )}
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //
        //                         {/* Images Section */}
        //                         {(!isNewIngredient || isEditing) && (
        //                             <div className="mt-5 pt-5 content-section-separator">
        //                                 <h2 className="title is-5 mb-4">Images</h2>
        //                                 {/* Image rendering logic */}
        //                             </div>
        //                         )}
        //
        //                         {/* Footer */}
        //                         {!isNewIngredient && ingredient && (
        //                             <div className="mt-5 pt-5 content-section-separator">
        //                                 <div className="level is-mobile">
        //                                     <div className="level-left">
        //                                         <p className="is-size-7 has-text-grey">Created: {new Date(ingredient.created_timestamp).toLocaleString()}</p>
        //                                     </div>
        //                                     <div className="level-right">
        //                                         <p className="is-size-7 has-text-grey">Last Modified: {new Date(ingredient.modified_timestamp).toLocaleString()}</p>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </section>

    );
}

export default IngredientForm;