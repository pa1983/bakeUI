import {useState} from 'react';
import {useParams} from 'react-router-dom';

import {createEmptyRecipe} from '../../models/IRecipe';
import {fetchRecipe, postNewRecipe} from '../../services/recipeService';
import {useData} from '../../contexts/DataContext';
import {useAuth} from "react-oidc-context";
import RecipeForm from './RecipeForm';
import {ElementView} from '../Common/ElementView';
import IngredientList from "../Ingredient/IngredientList.tsx";
import type {IRecipeIngredient} from "../../models/IRecipeIngredient";
import {postNewRecipeIngredient} from "../../services/recipeIngredientService.ts";
import useFlash from "../../contexts/FlashContext.tsx";
import RecipeElementList from "./RecipeElementList.tsx";
import type {IRecipeLabour} from '../../models/IRecipeLabour';
import {postNewRecipeLabour} from '../../services/recipeLabourService';
import LabourerList from "../Labourer/LabourerList.tsx";
import RecipeList from "./RecipeList.tsx";
import type {IRecipeSubRecipe} from "../../models/IRecipeSubRecipe.ts";
import {postNewRecipeSubRecipe} from "../../services/recipeSubRecipeService.ts";

// Define the possible picker states
type ActivePicker = 'subrecipe' | 'ingredient' | 'labour' | 'none';

const ViewRecipeForm = () => {
    const {id} = useParams<{ id: string }>();
    const recipeIdNumber = Number(id);
    const {showFlashMessage} = useFlash();
    const {refetchRecipes: refetchDataList} = useData();
    const auth = useAuth();

    // --- STATE REFACTOR ---
    // Use a single state to manage which picker is visible
    const [activePicker, setActivePicker] = useState<ActivePicker>('none');

    const recipeConfig = {
        prop_element_id: id,
        primaryKeyName: 'recipe_id' as const,
        elementName: 'Recipe',
        apiEndpoint: 'recipe',
        createEmptyElement: createEmptyRecipe,
        getElement: fetchRecipe,
        postNewElement: postNewRecipe,
        refetchDataList: refetchDataList,
        FormComponent: RecipeForm,
    };

    // State to trigger refetching of the main element list
    const [refetchElements, setRefetchElements] = useState<number>(0);
    const triggerElementRefetch = () => {
        setRefetchElements(prev => prev + 1);
    };

    // --- HANDLERS ---

    // Generic handler to toggle pickers
    const handleTogglePicker = (picker: ActivePicker) => {
        setActivePicker(current => (current === picker ? 'none' : picker));
    };

    // callback function for behaviour when a recipe element is clicked in the sub recipe picker.

    const onSubRecipeSelect = async (selectedId: string | number) => {
        // --- FIX #1: Handle Flexible Input from the Picker ---
        // The `onSelectOverride` prop from your generic list component is flexible
        // and can provide a string or a number. We handle that here by accepting
        // `string | number` and safely parsing it.
        const subRecipeId = Number(selectedId);

        if (isNaN(subRecipeId) || subRecipeId === 0) {
            showFlashMessage('Invalid sub-recipe selected.', 'danger');
            console.error("Invalid ID passed to onSubRecipeSelect:", selectedId);
            return;
        }

        if (!recipeIdNumber || auth.isLoading || !auth.user?.access_token) {
            showFlashMessage('You must be logged in to modify a recipe', 'danger');
            return;
        }

        // --- FIX #2: Create the Correct Data Structure for the API ---
        // This is the `Omit` pattern we established. It's the correct way to
        // create an object for a *new* database entry, as it has no 'id' yet.
        // This perfectly matches the signature of your reusable `postNewElement` factory.
        const formData: IRecipeSubRecipe = {
            id: recipeIdNumber,
            parent_recipe_id: recipeIdNumber,
            sub_recipe_id: subRecipeId,
            quantity: 0,
            uom_id: 1, // Default UOM todo - should get the default from the sub-recipe
            notes: '',
            sort_order: 1000
        };

        // This call is now fully type-safe from end to end.
        await postNewRecipeSubRecipe(formData, auth.user.access_token);
        triggerElementRefetch();
        setActivePicker('none');
        showFlashMessage('Sub-Recipe added!', 'success');
    };


    // callback function for when an ingredient is selected in the ingredient picker
    const onIngredientSelect = async (selectedId: string | number) => {
        const ingredientId = Number(selectedId);
        if (!ingredientId || auth.isLoading || !auth.user?.access_token) {
            showFlashMessage('You must be logged in to modify a recipe', 'danger');
            return;
        }
        if (isNaN(ingredientId) || ingredientId === 0) {
            showFlashMessage('Invalid sub-recipe selected.', 'danger');
            console.error("Invalid ID passed to onSubRecipeSelect:", ingredientId);
            return;
        }

        if (!recipeIdNumber || auth.isLoading || !auth.user?.access_token) {
            showFlashMessage('You must be logged in to modify a recipe', 'danger');
            return;
        }

        const formData: IRecipeIngredient = {
            id: 0, // A temporary ID, the backend will assign the real one.
            recipe_id: recipeIdNumber,
            ingredient_id: ingredientId,
            quantity: 0,
            uom_id: 1, // Default UOM   todo - should get the default from the  ingredient
            notes: '',
            sort_order: 1000  // will always drop to the bottom of the list
        };

        await postNewRecipeIngredient(formData, auth.user.access_token);
        triggerElementRefetch();
        setActivePicker('none'); // Hide picker after selection
        showFlashMessage('Ingredient added!', 'success');
    };

    // Callback function, drilled down to the picker element, for action to take when a picker element is clicked to add a new labour item to the recipe
    const onLabourSelect = async (selectedId: string |number) => {
        const labourerId = Number(selectedId);

        if (!labourerId || auth.isLoading || !auth.user?.access_token) {
            showFlashMessage('You must be logged in to modify a recipe', 'danger');
            return;
        }


        if (!recipeIdNumber || auth.isLoading || !auth.user?.access_token) {
            showFlashMessage('You must be logged in to modify a recipe', 'danger');
            return;
        }

        const formData: IRecipeLabour = {
            id: 0, // A temporary ID, the backend will assign the real one.
            recipe_id: recipeIdNumber,
            labourer_id: labourerId,
            labour_minutes: 0,
            labour_category_id: 1, // Default category
            description: '',
            sort_order: 1000
        };

        await postNewRecipeLabour(formData, auth.user.access_token);
        triggerElementRefetch();
        setActivePicker('none');
        showFlashMessage('Labour task added!', 'success');
    };


    return (
        <>
            {/* the recipe form */}
            <ElementView config={recipeConfig}/>

            {(id && parseInt(id) > 0) ? (
                <div className="field is-grouped mt-4">

                    <div className="control">
                        <button className="button recipe-sub-recipe" onClick={() => handleTogglePicker('subrecipe')}>
                            Add Sub Recipe
                        </button>
                    </div>
                    <div className="control">
                        <button className="button recipe-ingredient" onClick={() => handleTogglePicker('ingredient')}>
                            Add Ingredient
                        </button>
                    </div>
                    <div className="control">
                        <button className="button recipe-labour" onClick={() => handleTogglePicker('labour')}>
                            Add Labour
                        </button>
                    </div>
                    {/* "Hide All" button only shows when a picker is active */}
                    {activePicker !== 'none' && (
                        <div className="control">
                            <button className="button is-primary" onClick={() => setActivePicker('none')}>
                                Hide All
                            </button>
                        </div>
                    )}
                </div>
            ) : <p>Recipe elements can only be added once recipe details have been saved</p>
            }


            {/* Conditionally render the Sub-Recipe Picker */}
            {activePicker === 'subrecipe' && (
                <div className="box">
                    <RecipeList
                        onSelectOverride={onSubRecipeSelect}
                        title="Select Sub-Recipe to Add"
                    />
                </div>
            )}
            {/* Conditionally render the Ingredient Picker */}
            {activePicker === 'ingredient' && (
                <div className="box">
                    <IngredientList
                        onSelectOverride={onIngredientSelect}
                        title="Select Ingredient to Add"
                    />
                </div>
            )}

            {/* Conditionally render the Labour Picker */}
            {activePicker === 'labour' && (
                <div className="box">
                    <LabourerList
                        onSelectOverride={onLabourSelect}
                        title="Select Labour Type to Add"
                    />
                </div>
            )}


            <hr/>

            {/* The main list of combined recipe elements - hidden when a picker is active */}
            {id && (activePicker === 'none') &&
                <RecipeElementList
                    recipe_id={Number(id)}
                    refetchTrigger={refetchElements}
                />
            }
        </>
    );
};

export default ViewRecipeForm;
